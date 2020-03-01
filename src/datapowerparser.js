const DataPowerObjects = require("./datapowerobjects");
const DataPowerObjectTypes = require("./datapowerenums").DataPowerObjectTypes;
const xpath = require('xml2js-xpath');

class DataPowerParser {
  
  static initCap(str)
  {
      return str.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
              return m.toUpperCase();
          });
  }

  static transformPropertyName(name)
  {
    let objPropName = name;
    if(name == 'xmlns:env' || name == 'xmlns:dp')
      return;

    if(objPropName.indexOf("dp:")>=0)
    {
            objPropName = objPropName.replace("dp:", "");
    }
    if(objPropName.indexOf("env:")>=0)
    {
            objPropName = objPropName.replace("env:", "");
    }

    objPropName = DataPowerParser.initCap(objPropName);
    return objPropName;
  }

  static parseObject(xmlObj)
  {
  
    let obj = {};
    if(xmlObj)
    {
       let propNames = Object.getOwnPropertyNames(xmlObj);
       if(propNames.length==2)
       {
          if(propNames[0]=='_' && propNames[1]=='$')
          {
              return xmlObj[propNames[0]];    
          }
       }
       propNames.forEach(propName => {
          let propValue = xmlObj[propName];
  
          let objPropName = DataPowerParser.transformPropertyName(propName);

          if(objPropName)
          {
          let objValue;
          if(propName == '$')
          {
             if(typeof propValue == "object")
             {
                  let dollarNames = Object.getOwnPropertyNames(propValue);
                  dollarNames.forEach(dollarName =>{

                    let objDollarName = DataPowerParser.transformPropertyName(dollarName);
                    if(objDollarName)
                    {
                      let dollarValue = propValue[dollarName];
                      if(dollarValue)
                      {
                        obj[objDollarName] = dollarValue;
                      }     
                    }
                  });
                  return;
             }     
          }
          else
          if(propValue instanceof Array)
          {
             //console.log(propName+"->"+propValue+"->Array"+propValue.length);
             if(propValue.length>1)
             {
                  objValue = [];
                  propValue.forEach(el=>{
                   let elObj = DataPowerParser.parseObject(el);
                   if(elObj)
                    objValue.push(elObj);
                  });
             }
             else
             if(propValue.length == 1)
             {
                let propFirst = propValue[0];
                if(typeof propFirst == 'string')
                {
                    objValue = propFirst.replace(/(\r\n|\n|\r)/gm, "").trim();
                }     
                else
                {
                    objValue = DataPowerParser.parseObject(propFirst);    
                }
                
             }  
             else
             {
                     objValue = '';
             }
  
             obj[objPropName] = objValue;
          }
          else
          if(typeof propValue == 'object')
          {
             obj[objPropName] = DataPowerParser.parseObject(propValue);
          }
          else
          {
             obj[objPropName] = propValue;
          }
        }
       });
    }
    return obj;
  }
  static parseDPObject(name, xmlObj) {
    let obj;
    try {
      let basePart =  xpath.find(xmlObj, "//dp:response")[0]; 
      if(!basePart)
      {
          basePart  =  xpath.find(xmlObj, "//env:Body")[0]; 
      }
      console.log('---------', basePart);
      obj = DataPowerParser.parseObject(basePart);
      // let status = xpath.find(basePart, "//dp:status");
    
      // if (name == DataPowerObjectTypes.DPFileStore) {
      //   let xmlPart =
      //    basePart[
      //       "dp:filestore"
      //     ][0];

      //   obj = DataPowerParser.parseDPFileStore(xmlPart);
      // }
      // else
      // if(name == DataPowerObjectTypes.DPFileContents)
      // {
      //     let xmlPart = basePart["dp:file"][0];
      //     obj = DataPowerParser.parseDPFileContents(xmlPart);
      // }
      // else
      // if(name == DataPowerObjectTypes.DPResult)
      // {
      //   let xmlPart = basePart["dp:result"][0];
      //   obj = new DataPowerObjects.DPResult(xmlPart);
      // }
      // else
      // if(name == DataPowerObjectTypes.DPLog)
      // {
       
      //   obj = DataPowerParser.parseDPLog(basePart);
      // }
    } catch (e) {
      console.error(e);
    }
    return obj;
  }

  static parseDPFileStore(xmlObj) {
    let obj;

    if (xmlObj) {
      let location = xmlObj["location"];

      if (location) {
        obj = new DataPowerObjects.DPFileStore();

        let fileDirectories = [];

        if (location.length > 0) {
          location.forEach(directoryXml => {
            let fileDirectory = DataPowerParser.parseDPFileDirectory(
              directoryXml
            );
            if (fileDirectory) {
              fileDirectories.push(fileDirectory);
            }
          });
        }

        obj.fileDirectories = fileDirectories;
      }
    }

    return obj;
  }

  static parseDPFileDirectory(xmlObj) {
    let obj;
    if (xmlObj) {
      let props = xmlObj["$"];
      let file = xmlObj["file"];

      obj = new DataPowerObjects.DPFileDirectory();
      obj.name = props["name"];
      if (obj.name) {
        obj.name = obj.name.replace(":", "");
      }
      obj.canRead = props["read"] == "true";
      obj.canWrite = props["write"] == "true";
      obj.canLog = props["log"] == "true";
      obj.canDelete = props["del"] == "true";
      obj.isList = props["list"] == "true";
      obj.xmlObject = props;

      if (file) {
        let files = [];
        file.forEach(fileXml => {
          let fileObj = DataPowerParser.parseDPFile(obj.name, fileXml);
          if (fileObj) {
            files.push(fileObj);
          }
        });
        obj.files = files;
      }
    }

    return obj;
  }

  static parseDPFile(directory, xmlObj) {
    let obj;

    if (directory && xmlObj) {
      let props = xmlObj["$"];
      if (props) {
        obj = new DataPowerObjects.DPFile();
        obj.directory = directory;
        obj.name = props["name"];

        obj.size = xmlObj["size"] ? xmlObj["size"][0] || 0 : 0;
        obj.modified = xmlObj["modified"] ? xmlObj["modified"][0] || "" : "";
        obj.xmlObject = xmlObj;
      }
    }

    return obj;
  }

  static parseDPFileContents(xmlObj) {
    let obj;

    if (xmlObj) {

      
      let props = xmlObj["$"];
      if (props) {
        obj = new DataPowerObjects.DPFile();

        obj.name = props["name"];
        obj.contents = xmlObj["_"];
        obj.xmlObject = xmlObj;
      }
    }

    return obj;
  }

  static parseDPLog(xmlObj)
  {
    let obj;

    if(!xmlObj)
    {
      return obj;
    }

    let logEntries = [];
    let logData = xpath.find(xmlObj, "//dp:log/log-entry");
    logData.forEach(logEntryData=>{

      let logEntry = DataPowerParser.parseDPLogEntry(logEntryData);
      if(logEntry)
      {
        logEntries.push(logEntry);
      }
    });
    obj = new DataPowerObjects.DPLog();
    obj.logEntries = logEntries;

    return obj;
  }

  static parseDPLogEntry(xmlObj) {
    let obj;

    if (xmlObj) {

      obj = new DataPowerObjects.DPLogEntry();
      obj.date = xmlObj['date'][0];
      obj.time = xmlObj['time'][0];
      obj.dateTime = xmlObj['date-time'][0];
      obj.class = xmlObj['time'][0];
      obj.object = xmlObj['object'][0];
      obj.level = xmlObj['level'][0];
      obj.transaction = xmlObj['transaction'][0];
      obj.gtid = xmlObj['gtid'][0];
      obj.client = xmlObj['client'][0];
      obj.code = xmlObj['code'][0];
      obj.file = xmlObj['file'][0];
      obj.message = xmlObj['message'][0];
    }

    return obj;
  }

}

module.exports = DataPowerParser;
