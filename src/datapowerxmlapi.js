/***
 *  DataPower XML management interface API
 *  Author: Raj Bandi (http://www.rajbandi.dev)
 *  Date: 15-Nov-2019
 ***/
const Buffer = require("buffer").Buffer;
const fs = require("fs");
const needle = require("needle");
const xml2js = require("xml2js");

const DataPowerEnums = require("./datapowerenums");
const DataPowerObjects = require("./datapowerobjects");
const DataPowerParser = require("./datapowerparser");
const DataPowerObjectTypes = require("./datapowerenums").DataPowerObjectTypes;

const StatusTypes = DataPowerEnums.DataPowerStatusTypes;
const ConfigTypes = DataPowerEnums.DataPowerConfigTypes;
const ExportFormats = DataPowerEnums.DataPowerExportFormats;

class DataPowerXmlApi {
  options = {};
  url = "";
  domain;
  soapRequestXml = {};
  parser = new xml2js.Parser();
  builder = new xml2js.Builder();
  debugMode = false;

  constructor(options) {
    if (!options) {
      throw "Options required";
    }
    if (options.domain) {
      this.domain = options.domain;
    }

    if (options.debugMode) {
      this.debugMode = options.debugMode;
    }
    this.url = options.endpoint;
    this.options = {
      username: options.username,
      password: options.password,
      rejectUnauthorized: false
    };
  }

  switchDomain(domain) {
    this.domain = domain;
  }

  setDebug(debug) {
    this.debugMode = debug;
  }

  sendRequest(body) {
    var that = this;
    return new Promise(function(resolve, reject) {
      try {
        needle.post(that.url, body, that.options, function(err, resp) {
          if (err) reject(err);
          else resolve(resp.body.toString("utf8"));
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  getSoapRequest(body) {
    let reqDomain = "";

    if (this.domain) {
      reqDomain = ' domain="' + this.domain + '" ';
    }
    let req = '<?xml version="1.0" encoding="UTF-8"?>\n';
    req +=
      '<env:Envelope xmlns:env="http://www.w3.org/2001/12/soap-envelope">\n';
    req += "<env:Body>\n";
    req +=
      '<dp:request xmlns:dp="http://www.datapower.com/schemas/management" ' +
      reqDomain +
      " >\n";

    if (body) {
      req += body + "\n";
    }
    req += "</dp:request>\n";
    req += "</env:Body>\n";
    req += "</env:Envelope>\n";

    return req;
  }

  async getResponse(body) {
    let request = this.getSoapRequest(body);

    if (this.debugMode) {
      let str = request.replace(
        /<dp:input-file.*?<\/dp:input-file>/g,
        "<dp:input-file></dp:input-file>"
      );
      console.log(str);
    }

    let resp = await this.sendRequest(request);

    if (this.debugMode) {
      let str1 = resp.replace(/<dp:file.*?<\/dp:file>/g, "<dp:file></dp:file>");
      console.log(str1);
    }

    let parsedResp = await this.parseResponse(resp);
    let obj = DataPowerParser.parseDPObject(parsedResp.data);
    if (obj.result) {
      obj["success"] = obj.result == "OK";
    } else if (obj.Fault) {
      obj["success"] = false;
    }
    parsedResp["DPObject"] = obj;

    return parsedResp;
  }

  async parseResponse(xml, errs) {
    let data = await this.parser.parseStringPromise(xml);
    let response = {
      errors: errs || [],
      data: data,
      isValid: !errs
    };
    return response;
  }

  toXml(obj) {
    let xml = this.builder.buildObject(obj);
    return xml;
  }

  async getStatuses(statusType) {
    let classType = "";
    if (statusType) {
      classType = ' class="' + statusType + '" ';
    }
    let body = "<dp:get-status " + classType + "/>";

    return this.getResponse(body);
  }

  async getConfig(configType, configName) {
    let classType = "";
    if (configType) {
      classType = ' class="' + configType + '" ';
    }
    let name = "";
    if (configName) {
      name = ' name="' + configName + '"';
    }
    let body = "<dp:get-config " + classType + name + "/>";
    return this.getResponse(body);
  }
  async setConfig(configBody) {
    let body = "<dp:set-config >";
    body += configBody;
    body += "</dp:set-config>";
    return this.getResponse(body);
  }

  async modifyConfig(configBody) {
    let body = "<dp:modify-config>";
    body += configBody;
    body += "</dp:modify-config>";
    return this.getResponse(body);
  }

  async delConfig(configType, configName) {
    if (!configType) {
      throw "Config type is required";
    }
    if (!configName) {
      throw "Config name is required";
    }
    let name = ' name="' + configName + '"';

    let body = "<dp:del-config >";
    body += "<" + configType + name + "/>";
    body += "</dp:del-config>";
    return this.getResponse(body);
  }

  async saveConfig() {
    let body = "<SaveConfig />";
    return await this.doAction(body);
  }

  async exportConfig(exportOptions) {
    if (!exportOptions) {
      exportOptions = {};
    }
    if (!exportOptions.configs) {
      exportOptions.configs = [{ refFiles: true, refObjects: true }];
    }
    if (!exportOptions.options) {
      exportOptions.options = { allFiles: true, format: ExportFormats.Zip };
    }

    let options = "";
    if (exportOptions.options) {
      let allFiles = exportOptions.options.allFiles || true;
      let format = exportOptions.options.format || ExportFormats.Zip;
      //    let deploymentPolicy = exportOptions.options.deploymentPolicy || 'DeploymentPolicy';
      options += ' format="' + format + '" ';
      options += ' all-files="' + allFiles + '" ';
      //      options += ' deployment-policy="'+(deploymentPolicy)+'" ';
    }
    let body = "<dp:do-export " + options + ">";
    if (exportOptions.comment) {
      body +=
        "<dp:user-comment>" + exportOptions.comment + "</dp:user-comment>";
    }
    if (exportOptions.configs) {
      exportOptions.configs.forEach(object => {
        let objectName = ConfigTypes.AllObjects;
        if (object.name) {
          objectName = object.name;
        }
        let name = ' name="' + objectName + '" ';

        let classTypeName = ConfigTypes.AllClasses;
        if (object.configType) {
          classTypeName = object.configType;
        }

        let classType = ' class="' + classTypeName + '" ';
        let refObjects = object.refObjects || true;
        let refFiles = object.refFiles || true;
        let includeDebug = object.includeDebug || false;
        body +=
          "<dp:object " +
          classType +
          " " +
          name +
          ' ref-objects="' +
          refObjects +
          '" ref-files="' +
          refFiles +
          '" />\n';
      });
    }

    body += "</dp:do-export>";
    return await this.getResponse(body);
  }

  async importConfig(importOptions, domain) {
    if (!importOptions) {
      importOptions = {};
    }

    if (!importOptions.options) {
      importOptions.options = {
        dryRun: false,
        overwriteObjects: true,
        overwriteFiles: true,
        rewriteLocalIP: true,
        sourceType: ExportFormats.Zip
      };
    }

    let options = "";
    if (importOptions.options) {
      let dryRun = importOptions.options.dryRun || false;
      let sourceType = importOptions.options.format || ExportFormats.Zip;
      let overwriteFiles = importOptions.options.overwriteFiles || true;
      let overwriteObjects = importOptions.options.overwriteObjects || true;
      let rewriteLocalIP = importOptions.options.rewriteLocalIP || true;

      options += ' source-type="' + sourceType + '" ';
      //options += ' dryRun="'+dryRun+'" ';
      options += ' overwrite-files="' + overwriteFiles + '" ';
      options += ' overwrite-objects="' + overwriteObjects + '" ';
      //options += ' rewrite-local-ip="'+rewriteLocalIP+'" ';
    }
    let body = "<dp:do-import " + options + ">";

    if (importOptions.inputFilePath) {
      let contents = fs.readFileSync(importOptions.inputFilePath, {
        encoding: "base64"
      });
      body += "<dp:input-file>" + contents + "</dp:input-file>";
      console.log(contents.length);
    } else if (importOptions.inputFile) {
      let base64 = importOptions.inputFile;
      body += "<dp:input-file>" + base64 + "</dp:input-file>";
    } else {
      throw "Input file is required";
    }

    if (importOptions.file) {
      let name = importOptions.file.name;
      let overwrite = importOptions.file.overwrite || true;
      if (name) {
        body += '<dp:file name="' + name + '" overwrite="' + overwrite + '" />';
      }
    }
    if (importOptions.configs) {
      importOptions.configs.forEach(object => {
        let name = "";
        if (object.name) {
          name += ' name="' + object.name + '" ';
        }
        let classType = "";
        if (object.configType) {
          classType += ' class="' + object.configType + '" ';
        }
        let overw = object.overwrite || true;
        body += "<dp:object " + classType + " " + name + "   />\n";
      });
    }
    if (importOptions.comment) {
      body +=
        "<dp:user-comment>" + exportOptions.comment + "</dp:user-comment>";
    }

    body += "</dp:do-import>";
    return await this.getResponse(body);
  }

  async createBackup() {}

  async restoreBackup() {}

  async retrieveB2BMetadata() {}

  async retrieveLoginToken() {}

  async compareConfigs() {}

  async generateConformanceReport() {}

  async doAction(actionBody) {
    let body = "<dp:do-action>";
    body += actionBody;
    body += "</dp:do-action>";
    return this.getResponse(body);
  }

  async deleteFile(filePath) {
    let body = "<DeleteFile>\n";
    body += "<File>" + filePath + "</File>\n";
    body += "</DeleteFile>\n";
    return await this.doAction(body);
  }

  async fetchFile(url, filePath, overwrite) {
    if (!url) {
      throw "URL is required";
    }
    if (!filePath) {
      throw "FilePath is required";
    }

    let body = "<FetchFile>\n";
    body += "<URL>" + url + "</URL>\n";
    body += "<File>" + filePath + "</File>\n";
    body += "<Overwrite>" + (overwrite ? "on" : "off") + "</Overwrite>\n";
    body += "</FetchFile>\n";
    return await this.doAction(body);
  }

  async createDir(directoryPath) {
    if (!directoryPath) {
      throw "directoryPath is required";
    }

    let body = "<CreateDir>\n";
    body += "<Dir>" + directoryPath + "</Dir>\n";
    body += "</CreateDir>\n";
    return await this.doAction(body);
  }

  async removeDir(directoryPath) {
    if (!directoryPath) {
      throw "directoryPath is required";
    }

    let body = "<RemoveDir>\n";
    body += "<Dir>" + directoryPath + "</Dir>\n";
    body += "</RemoveDir>\n";
    return await this.doAction(body);
  }

  async getFileStore(directory) {
    let location = "";
    if (directory) {
      location = ' location="' + directory + '" ';
    }
    let body = "<dp:get-filestore " + location + "  >";

    body += "</dp:get-filestore>";

    return this.getResponse(body);
  }

  async getLog(target) {
    let logTarget = "";
    if (target) {
      logTarget = ' name="' + target + '" ';
    }
    let body = "<dp:get-log " + logTarget + "/>";

    return this.getResponse(body);
  }

  async downloadFileByPath(filePath) {
    let name = "";
    if (filePath) {
      name = ' name="' + filePath + '" ';
    }
    let body = "<dp:get-file " + name + "/>";

    let result = await this.getResponse(body);
    let dpObject = result.DPObject;
    if (dpObject.file) {
      dpObject["success"] = true;
    }
    return dpObject;
  }

  async downloadFile(directory, fileName) {
    var filePath = directory + fileName;
    return this.downloadFileByPath(filePath);
  }

  async uploadFile(filePath, contents) {
    if (!filePath) {
      throw "File path is required";
    }
    if (!contents || contents.length == 0) {
      throw "File contents is required";
    }

    let name = "";
    if (filePath) {
      name = ' name="' + filePath + '" ';
    }
    let body = "<dp:set-file " + name + ">";
    body += contents;
    body += "</dp:set-file>\n";
    return this.getResponse(body);
  }

  async createDomain(options) {
    let domainName = options.domain;
    let comment = options.comment || "";
    let adminState = options.adminState || true;

    if (!domainName) {
      throw "domainName is required";
    }

    let body =
      '<Domain  xmlns:env="http://www.w3.org/2003/05/soap-envelope" name="' +
      domainName +
      '" >';
    body +=
      "<mAdminState>" +
      (adminState ? "enabled" : "disabled") +
      "</mAdminState>";

    body += "<NeighborDomain>default</NeighborDomain>";
    if (comment) body += "<userSummary>" + comment + "</userSummary>";

    body += "</Domain>";

    let domainResult = await this.setConfig(body);
    let dpObject = domainResult.DPObject;
    return dpObject && dpObject.result == "OK";
  }

  async deleteDomain(domainName) {
    if (!domainName) {
      throw "domainName is required";
    }
    let result = await this.delConfig(ConfigTypes.Domain, domainName);
    return result.DPObject;
  }

  async getDomains() {
    let domains = [];
    let status = await this.getStatuses(StatusTypes.DomainSummary);
    let dpObject = status.DPObject;
    if (dpObject && dpObject.status && dpObject.status.DomainSummary) {
      let domainSummary = dpObject.status.DomainSummary;
      if (domainSummary instanceof Array) {
        // console.log(JSON.stringify(dpObject.status.DomainSummary));
        domains = dpObject.status.DomainSummary.map(domainInfo => {
          return domainInfo.Domain;
        });
      } else {
        domains.push(domainSummary.Domain);
      }
    }
    return domains;
  }
  async getDomainsStatuses() {
    let domains = [];
    let status = await this.getStatuses(StatusTypes.DomainStatus);
    let dpObject = status.DPObject;
    if (dpObject && dpObject.status && dpObject.status.DomainStatus) {
      domains = dpObject.status.DomainStatus;
    }
    return domains;
  }

  async getWebServiceProxies(name) {
    let proxies = [];
    let gateways = await this.getConfig(ConfigTypes.WSGateway, name);
    let dpObj = gateways.DPObject;
    if (dpObj && dpObj.config && dpObj.config.WSGateway) {
      let services = dpObj.config.WSGateway;
      if (services instanceof Array) {
        proxies = services;
      } else {
        proxies.push(services);
      }

      for (let index in proxies) {
        let service = proxies[index];
        if (service) {
          let fshName = service.EndpointRewritePolicy;

          if (fshName) {
            let rewritePolicies = await this.getWebServiceFSH(fshName);

            if (rewritePolicies.length > 0) {
              //console.log(service.EndpointRewritePolicy);
              let fsh = rewritePolicies.find(
                fshPolicy => fshPolicy.name == fshName
              );

              if (fsh) {
                service["EndpointRewritePolicyDetails"] = fsh;
              }
            }
          } // end of fshname

          let aaaName = service.AAAPolicy;
          console.log('AAAA '+aaaName);
          if(aaaName)
          {
            let aaaPolicies = await this.getWebServiceAAA(aaaName);
            console.log(service.aaaPolicies);
            if (aaaPolicies.length > 0) {
              //console.log(service.EndpointRewritePolicy);
              let  aaa = aaaPolicies.find(
                policy => policy.name == aaaName
              );

              if (aaa) {
                service["AAAPolicyDetails"] = aaa;
              }
            }
          }

          let styleName = service.StylePolicy;
          console.log('StyleName'+styleName);
          if(styleName)
          {
            let stylePolicies = await this.getWebServiceStyle(styleName);
            console.log(service.stylePolicies);
            if (stylePolicies.length > 0) {
              //console.log(service.EndpointRewritePolicy);
              let  style = stylePolicies.find(
                policy => policy.name == styleName
              );

              if (style) {
                service["StylePolicyDetails"] = style;
              }
            }
          }
        }
      }
    }
    return proxies;
  }

  async getWebServiceFSH(name) {
    let policies = [];
    let gateways = await this.getConfig(
      ConfigTypes.WSEndpointRewritePolicy,
      name
    );
    let dpObj = gateways.DPObject;
    if (dpObj && dpObj.config && dpObj.config.WSEndpointRewritePolicy) {
      let services = dpObj.config.WSEndpointRewritePolicy;
      if (services instanceof Array) {
        policies = services;
      } else {
        policies.push(services);
      }
    }
    return policies;
  }
  async getWebServiceAAA(name) {
    let policies = [];
    let gateways = await this.getConfig(ConfigTypes.AAAPolicy, name);
    let dpObj = gateways.DPObject;
    if (dpObj && dpObj.config && dpObj.config.AAAPolicy) {
      let services = dpObj.config.AAAPolicy;
      if (services instanceof Array) {
        policies = services;
      } else {
        policies.push(services);
      }
    }
    return policies;
  }

  async getWebServiceStyle(name) {
    let policies = [];
    let gateways = await this.getConfig(ConfigTypes.WSStylePolicy, name);
    let dpObj = gateways.DPObject;
  
    if (dpObj && dpObj.config && dpObj.config.WSStylePolicy) {
      let services = dpObj.config.WSStylePolicy;
      if (services instanceof Array) {
        policies = services;
      } else {
        policies.push(services);
      }
    }
   
    return policies;
  }

  async expotWebServiceProxy(name) {
    let gateways = await this.exportConfig({
      configs: [
        {
          configType: ConfigTypes.WSGateway,
          name: name
        }
      ]
    });
    return await this.getExportResponse(gateways);
  }

  async getWebServices() {
    let services = [];
    let resp = await this.getStatuses(StatusTypes.WSGatewaySummary);

    let dpObject = resp.DPObject;
    if (dpObject && dpObject.status && dpObject.status.WSGatewaySummary) {
      services = dpObject.status.WSGatewaySummary.map(
        service => service.WSGateway
      );
    }
    return services;
  }

  async getWebServiceHandlers(name) {
    let handlers = [];
    let gateways = await this.getConfig(
      ConfigTypes.HTTPSSourceProtocolHandler,
      name
    );
    let dpObj = gateways.DPObject;

    if (dpObj && dpObj.config && dpObj.config.HTTPSSourceProtocolHandler) {
      let services = dpObj.config.HTTPSSourceProtocolHandler;
      if (services instanceof Array) {
        handlers = services;
      } else {
        handlers.push(services);
      }
    }
    return handlers;
  }

  async getMultiProtocolGateway() {
    let proxies = [];
    let gateways = await this.getConfig(ConfigTypes.MultiProtocolGateway);
    console.log(gateways);
    return proxies;
  }

  async exportDomain(options) {
    let domain = options.domain;
    if (!domain) {
      throw "Domain is required";
    }

    let exportOptions = {
      domain: domain
    };
    exportOptions.options = {};
    if (options.format) {
      exportOptions.options["format"] =
        options.format == "Xml" ? ExportFormats.Xml : ExportFormats.Zip;
    }
    let exportResp = await this.exportConfig(exportOptions);
    return await this.getExportResponse(exportResp);
  }

  async getExportResponse(exportResp) {
    let errors = [];
    let fileContent = "";
    // console.log(exportResp.DPObject);
    if (exportResp.DPObject.Fault) {
      errors.push(exportResp.DPObject.Fault);
    }

    if (exportResp.DPObject.file) {
      fileContent = exportResp.DPObject.file;
    }

    return {
      success: errors.length == 0,
      errors: errors,
      content: fileContent
    };
  }

  async importDomain(options) {
    let domain = options.domain;
    let errors = [];
    let results = {};
    let test = options.test || false;
    if (!domain) {
      throw "Domain is required";
    }
    let fileContent = options.content;
    if (!fileContent) {
      throw "Content is required";
    }
    let importOptions = {
      inputFile: fileContent,
      options: {
        dryRun: test
      }
    };

    let importResp = await this.importConfig(importOptions);
    if (importResp.DPObject.Fault) {
      errors.push(importResp.DPObject.Fault);
    } else if (importResp.DPObject.result) {
      errors.push(importResp.DPObject.result);
    } else if (
      importResp.DPObject.import &&
      importResp.DPObject.import.importResults
    ) {
      results = importResp.DPObject.import.importResults;
    }
    return {
      success: errors.length == 0,
      errors: errors,
      results: results
    };
  }

  async updateCryptoKey(options) {
    if (!options.name) {
      throw "CryptoKey name is required";
    }

    let body = '<CryptoKey name="' + options.name + '">';

    if (options.fileName)
      body += "<Filename>" + options.fileName + "</Filename>";

    if (options.password)
      body += "<Password>" + options.password + "</Password>";

    if (options.passwordAlias)
      body += "<PasswordAlias>" + options.passwordAlias + "</PasswordAlias>";

    body += "</CryptoKey>";
    let domainResult = await this.modifyConfig(body);

    return domainResult;
  }

  async updateCryptoCertificate(options) {
    if (!options.name) {
      throw "CryptoCertificate name is required";
    }

    let body = '<CryptoCertificate name="' + options.name + '">';

    if (options.fileName)
      body += "<Filename>" + options.fileName + "</Filename>";

    if (options.password)
      body += "<Password>" + options.password + "</Password>";

    if (options.passwordAlias)
      body += "<PasswordAlias>" + options.passwordAlias + "</PasswordAlias>";

    body += "</CryptoCertificate>";
    let domainResult = await this.modifyConfig(body);

    return domainResult;
  }

  async updateWebserviceHttpsHandler(options) {
    if (!options.name) {
      throw "Webservice https handler name is required";
    }

    let body = '<HTTPSSourceProtocolHandler name="' + options.name + '">';

    if (options.address)
      body += "<LocalAddress>" + options.address + "</LocalAddress>";

    if (options.port) body += "<LocalPort>" + options.port + "</LocalPort>";

    body += "</HTTPSSourceProtocolHandler>";
    let domainResult = await this.modifyConfig(body);

    return domainResult;
  }

  async updateWebServiceRemoteDetails(options) {
    if (!options.name) {
      throw "Service Rewrite policy name is required";
    }
    let body =
      '<WSEndpointRewritePolicy name="' + options.name + '" local="true">\n';

    if (options.comment && options.comment.length > 0)
      body += "<UserSummary>" + options.comment + "</UserSummary>\n";

    body += "<WSEndpointRemoteRewriteRule>\n";

    if (options.servicePort) {
      body +=
        "<ServicePortMatchRegexp>" +
        options.servicePort +
        "</ServicePortMatchRegexp>\n";
    }
    if (options.protocol)
      body +=
        "<RemoteEndpointProtocol>" +
        options.protocol +
        "</RemoteEndpointProtocol>\n";
    if (options.host)
      body +=
        "<RemoteEndpointHostname>" +
        options.host +
        "</RemoteEndpointHostname>\n";
    if (options.port)
      body += "<RemoteEndpointPort>" + options.port + "</RemoteEndpointPort>\n";
    if (options.uri)
      body += "<RemoteEndpointURI>" + options.uri + "</RemoteEndpointURI>\n";

    body += "<RemoteMQQM/>\n";
    body += "<RemoteTibcoEMS />\n";
    body += "<RemoteWebSphereJMS />\n";
    body += "</WSEndpointRemoteRewriteRule>\n";
    body += "</WSEndpointRewritePolicy>\n";
    let result = await this.modifyConfig(body);

    console.log(result);
  }
  async updateWebServiceDetails(options) {
    if (!options.name) {
      throw "Service name is required";
    }
    let body = '<WSGateway name="' + options.name + '">\n';

    // if(options.policy)
    // {
    //   body += '<EndpointRewritePolicy>'+options.policy+'</EndpointRewritePolicy>\n';
    // }
    body += "<RemoteEndpointRewrite>\n";

    if (options.servicePort) {
      body +=
        "<ServicePortMatchRegexp>" +
        options.servicePort +
        "</ServicePortMatchRegexp>\n";
    }
    if (options.protocol)
      body +=
        "<RemoteEndpointProtocol>" +
        options.protocol +
        "</RemoteEndpointProtocol>\n";
    if (options.host)
      body +=
        "<RemoteEndpointHostname>" +
        options.host +
        "</RemoteEndpointHostname>\n";
    if (options.port)
      body += "<RemoteEndpointPort>" + options.port + "</RemoteEndpointPort>\n";
    if (options.uri)
      body += "<RemoteEndpointURI>" + options.uri + "</RemoteEndpointURI>\n";

    body += "<RemoteMQQM/>\n";
    body += "<RemoteTibcoEMS />\n";
    body += "<RemoteWebSphereJMS />\n";
    body += "</RemoteEndpointRewrite>\n";
    body += "</WSGateway>\n";
    let result = await this.modifyConfig(body);

    console.log(result);
  }

  async getObjectStatuses(options) {
    let statuses = [];
    let objectStatus = await this.getStatuses(StatusTypes.ObjectStatus);
    if(!options)
    {
      options = {
        
      };
    }
    let dpObj = objectStatus.DPObject;
    if (dpObj && dpObj.status && dpObj.status.ObjectStatus) {
      statuses = dpObj.status.ObjectStatus.filter(status => {
        return (
          (!status.OpState || status.OpState == status.OpState) &&
          (!options.ErrorCode || status.ErrorCode == options.ErrorCode)
        );
      });
    }

    return statuses;
  }
}

module.exports = {
  XmlApi: DataPowerXmlApi,
  StatusTypes: StatusTypes,
  ConfigTypes: ConfigTypes
};
