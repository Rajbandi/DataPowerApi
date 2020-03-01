/***
 *  DataPower XML management interface API
 * 
 *  Author: Raj Bandi
 * 
 *  Date: 15-Nov-2019
 * 
 */
const Buffer = require('buffer').Buffer;
const needle = require("needle");
const xml2js = require("xml2js");

const DataPowerEnums = require("./datapowerenums");
const DataPowerObjects = require("./datapowerobjects");
const DataPowerParser = require("./datapowerparser");
const DataPowerObjectTypes = require("./datapowerenums").DataPowerObjectTypes;

const DataPowerStatusTypes = DataPowerEnums.DataPowerStatusTypes
const DataPowerConfigTypes = DataPowerEnums.DataPowerConfigTypes;
const DataPowerExportFormats = DataPowerEnums.DataPowerExportFormats;

class DataPowerXmlApi {
  options = {};
  url = "";
  domain;
  soapRequestXml = {};
  parser = new xml2js.Parser();
  builder = new xml2js.Builder();

  constructor(options) {

    if(!options)
    {
      throw "Options required";
    }
    if(options.domain)
    {
      this.domain = options.domain;
    }

    this.url = options.endpoint;
    this.options = {
      username: options.username,
      password: options.password,
      rejectUnauthorized: false
    };
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

    let domain = "";
    if(this.domain)
    {
      domain = ' domain="'+this.domain+'" ';
    }
    let req = '<?xml version="1.0" encoding="UTF-8"?>\n';
    req +=
      '<env:Envelope xmlns:env="http://www.w3.org/2001/12/soap-envelope">\n';
    req += "<env:Body>\n";
    req +=
      '<dp:request xmlns:dp="http://www.datapower.com/schemas/management" '+domain+' >\n';
     
    if (body) {
      req += body + "\n";
    }
    req += "</dp:request>\n";
    req += "</env:Body>\n";
    req += "</env:Envelope>\n";
  
    return req;
  }

  async getResponse(body, objectName)
  {
    
    let request = this.getSoapRequest(body);
    console.log(request);
    let resp = await this.sendRequest(request);
    console.log(resp);
    let parsedResp = await this.parseResponse(resp);
    let obj = DataPowerParser.parseDPObject(objectName, parsedResp.data);
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
    let body = "<dp:get-status " + classType + '/>';
    
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
    body+="</dp:set-config>";
    return this.getResponse(body);
  }
  async delConfig(configType, configName) {
    
    if(!configType)
    {
      throw "Config type is required";
    }
    if(!configName)
    {
      throw "Config name is required";
    }
    let name = ' name="' + configName + '"';

    let body = "<dp:del-config >";
    body += "<"+configType + name + "/>";
    body += "</dp:del-config>"
    return this.getResponse(body);
  }
  
  async saveConfig()
  {
     let body = "<SaveConfig />";
     return await this.doAction(body);
  }

  async exportConfig(exportOptions)
  {
    if(!exportOptions)
    {
      exportOptions = {};
    }
    if(!exportOptions.configs)
    {
      exportOptions.configs = [{refFiles:true, refObjects:true}];
    }
    if(!exportOptions.options)
    {
      exportOptions.options = { allFiles:true, format: DataPowerExportFormats.Zip}
    }    

    let options = '';
    if(exportOptions.options)
    {
      let allFiles = exportOptions.options.allFiles || true;
      let format = exportOptions.options.format ||DataPowerExportFormats.Zip;
      let persisted = exportOptions.options.persisted || true;
      let deploymentPolicy = exportOptions.options.deploymentPolicy || 'DeploymentPolicy';
      options += ' format="'+(format)+'" ';
      options += ' all-files="'+(allFiles)+'" ';
      options += ' persisted="'+(persisted)+'" ';
      options += ' deployment-policy="'+(deploymentPolicy)+'" ';
    }
    let body = '<dp:do-export '+options+'>';
    if(exportOptions.comment)
    {
      body += '<dp:user-comment>'+exportOptions.comment+'</dp:user-comment>';
    }
    if(exportOptions.configs)
    {
      exportOptions.configs.forEach(object=>{
        let name = '';
        if(object.name)
        {
          name += ' name="'+object.name+'" ';
        }
        let classType = '';
        if(object.configType)
        {
          classType += ' class="'+object.configType+'" ';
        }
        let refObjects = object.refObjects || true;
        let refFiles = object.refFiles || true;
        let includeDebug = object.includeDebug || false;
        body += '<dp:object '+classType+' '+name+' ref-objects="'+refObjects+'" ref-files="'+refFiles+'" include-debug="'+includeDebug+'"/>\n';
      });
    }
 

    body += "</dp:do-export>";
    return await this.getResponse(body);
  }

  async importConfig(importOptions)
  {
    if(!importOptions)
    {
      importOptions = {};
    }
    if(!importOptions.configs)
    {
      importOptions.configs = [{importDebug:false, overwrite:true}];
    }
    if(!importOptions.options)
    {
      importOptions.options = { dryRun:false, overwriteObjects: true, overwriteFiles: true, rewriteLocalIP: true, sourceType: DataPowerExportFormats.Zip }
    }    

    let options = '';
    if(importOptions.options)
    {
      let dryRun = importOptions.options.allFiles || false;
      let sourceType = importOptions.options.format ||DataPowerExportFormats.Zip;
      let overwriteFiles = importOptions.options.overwriteFiles || true;
      let overwriteObjects = importOptions.options.overwriteObjects || true;
      let rewriteLocalIP = importOptions.options.rewriteLocalIP || true;
      
      options += ' dryRun="'+dryRun+'" ';
      options += ' overwrite-files="'+overwriteFiles+'" ';
      options += ' overwrite-objects="'+overwriteObjects+'" ';
      options += ' rewrite-local-ip="'+rewriteLocalIP+'" ';
      
      options += ' source-type="'+(sourceType)+'" ';
    }
    let body = '<do-import '+options+'>';

    if(importOptions.inputFilePath)
    {
      let contents = fs.readFileSync(inputFile);
      let base64 = Buffer.from(contents).toString('base64');
      body += '<input-file>'+base64+'</input-file>';
    }
    else
    if(importOptions.inputFile)
    {
      let base64 = importOptions.inputFile;
      body += '<input-file>'+base64+'</input-file>';
    }
    else
    {
      throw "Input file is required";
    }

    if(importOptions.file)
    {
      let name = importOptions.file.name;
      let overwrite = importOptions.file.overwrite || true;
      if(name)
      {
        body += '<file name="'+name+'" overwrite="'+overwrite+'" />';
      }

    }
    if(importOptions.configs)
    {
      importOptions.configs.forEach(object=>{
        let name = '';
        if(object.name)
        {
          name += ' name="'+object.name+'" ';
        }
        let classType = '';
        if(object.configType)
        {
          classType += ' class="'+object.configType+'" ';
        }
        body += '<dp:object '+classType+' '+name+' overwrite="'+object.overwrite+'" import-debug="'+object.importDebug+'" />\n';
      });
    }
    if(importOptions.comment)
    {
      body += '<dp:user-comment>'+exportOptions.comment+'</dp:user-comment>';
    }

    body += "</do-import>";
    return await this.getResponse(body);
  }


  async createBackup()
  {

  }

  async restoreBackup()
  {

  }

  async retrieveB2BMetadata()
  {

  }

  async retrieveLoginToken()
  {

  }

  async compareConfigs()
  {

  }

  async generateConformanceReport()
  {

  }

  async doAction(actionBody) {
    let body = "<dp:do-action>";
    body += actionBody;
    body +="</dp:do-action>";
    return this.getResponse(body);
  }

  async deleteFile(filePath)
  {
      let body = '<DeleteFile>\n';
      body += '<File>'+filePath+'</File>\n';
      body += '</DeleteFile>\n';
      return await this.doAction(body);
  }

  async fetchFile(url, filePath, overwrite)
  {
    if(!url)
    {
      throw "URL is required";
    }
    if(!filePath)
    {
      throw "FilePath is required"
    }

    let body = '<FetchFile>\n';
    body += '<URL>'+url+'</URL>\n';
    body += '<File>'+filePath+'</File>\n';
    body += '<Overwrite>'+(overwrite?"on":"off")+'</Overwrite>\n';
    body += '</FetchFile>\n';
    return await this.doAction(body);
  }

  async createDir(directoryPath)
  {
    if(!directoryPath)
    {
      throw "directoryPath is required";
    }
   
    let body = '<CreateDir>\n';
    body += '<Dir>'+directoryPath+'</Dir>\n';
    body += '</CreateDir>\n';
    return await this.doAction(body);
  }
  
  async removeDir(directoryPath)
  {
    if(!directoryPath)
    {
      throw "directoryPath is required";
    }
   
    let body = '<RemoveDir>\n';
    body += '<Dir>'+directoryPath+'</Dir>\n';
    body += '</RemoveDir>\n';
    return await this.doAction(body);
  }

  async getFileStore(directory) {
    let location = "";
    if (directory) {
      location = ' location="' + directory + '" ';
    }
    let body = "<dp:get-filestore " + location + '  >';
   
    body+= '</dp:get-filestore>';
   
    return this.getResponse(body);
  }

  async getLog(target){
    let logTarget = "";
    if(target)
    {
      logTarget = ' name="'+ target +'" ';
    }
    let body = "<dp:get-log " + logTarget + '/>';
   
    return this.getResponse(body);

  }

  async downloadFileByPath(filePath) {
    let name = "";
    if (filePath) {
      name = ' name="' + filePath + '" ';
    }
    let body = "<dp:get-file " + name + "/>";
   
    return this.getResponse(body);
  }

  async downloadFile(directory, fileName) {
    var filePath = directory + fileName;
    return this.getFileByPath(filePath);
  }

  async uploadFile(filePath, contents) {

    if(!filePath)
    {
      throw "File path is required";
    }
    if(!contents || contents.length ==0 )
    {
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

  async createDomain(domainName, comment, adminState)
  {
    if(!domainName)
    {
      throw "domainName is required";
    }
    
    let body = '<Domain  xmlns:env="http://www.w3.org/2003/05/soap-envelope" name="'+domainName+'" >';
    body+= '<mAdminState>'+(adminState?"enabled":"disabled")+'</mAdminState>';
    
    if(comment)
      body += '<userSummary>'+comment+'</userSummary>';
    
    body+='</Domain>';

    return await this.setConfig(body);
  }

  async deleteDomain(domainName)
  {
    if(!domainName)
    {
      throw "domainName is required";
    }
    return await this.delConfig(DataPowerConfigTypes.Domain, domainName);
  }

 
}

module.exports = {
  XmlApi: DataPowerXmlApi,
  StatusTypes: DataPowerStatusTypes,
  ConfigTypes: DataPowerConfigTypes
};
