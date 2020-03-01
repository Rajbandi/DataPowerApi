# DataPowerApi

## Introduction

IBM Data power provides XML management interface  as part of Application management protocol (AMP) to manage datapower objects and services using SOAP xml. It runs under default port 5550. This can be enabled/disabled through CLI config and web management interface. 

The only API available is in the form of ANT build scripts.

The current API entirely rewritten in NodeJS. The following are the main features of this api. Some features still in development.

## Api Methods

### Domain related
- switchDomain: Switch to a domain. Expects a domain name.
- getDomains : Get all the domains 
   returns list of domains
- createDomain : Creates a new domain. Expects the following options
  ```
  {
    domain: <domainName>,
    comment: <comment>,
    adminState: <true or false>
  }
  ```
- deleteDomain: Deletes a domain. Expects domain name.
- importDomain: Imports a domain. Expects the following options. If import format is Zip, content should be encoded in base64. 
  ```
    {
      domain: <domainName>,
      content: <fileContent in base64 format if Zip>
      test: <true or false> // dryRun
    }
  ```
- exportDomain: Exports a domain. Expects the following options. The default export format is Zip. The output will be base64 format always when Zip. Just decode and save as Zip file. 
```
{
  domain: <domain>,
  format: <format>, //Xml or Zip
}
```
### Config related
- saveConfig: Saves current configuration.
- delConfig: Deletes configuration. Expects enum ConfigTypes value and config name/
- getConfig: Gets configuration. Expects enum ConfigTypes value and config name.
- modifyConfig: Updates configuration. Expects configuration body. See datapower XML documentation to see body format.
- setConfig: Sets configuration.Expects configuration body. See datapower XML documentation to see body format.
### File related
- uploadFile: Uploads a file. Expects the following options
```
{
  filePath: <filePath where to store on dp>,
  contents: <contents in base64 format>
}
```
- deleteFile: Deletes a file. expects filePath
- fetchFile: Fetch a file. Expects url, filepath, overwrite.
- createDir: Creates a directory. Expects directory path.
- removeDir: Removes a directory. Expects directory path.
- downloadFile: Downloads a file. Expects directoryName, fileName.
- downloadFileByPath: Downloads a file by path. Expects filePath.
- getFileStore: Gets the file store. Expects directory path. 

### Statuses
- getObjectStatuses: Gets all the object statuses including services,crypto, fsh, policies, etc.
- getDomainStatuses: Gets the domain current statueses.

### Other Objects
- getWebServiceProxies: Gets all the web service proxies
- getWebServiceFSH: Gets FSH handler of a given web service proxy. Expects a proxy service name.
- getWebServiceAAA: Gets AAA policies of a given web service proxy. Expects a proxy service name.
- getWebServiceStyle: Gets all the style policies of a given webservice proxy. Expects a proxy service name.
- exportWebServiceProxy: Exports a webservice proxy. Expects a proxy service name.
- getMultiProtocolGateway: Gets multi protocol gateway's
- getWebServiceHandlers: Gets all the web service handlers of a given proxy service name.  Expects a proxy service name.
- exportWebServiceProxy: Exports a web service proxy.  Expects a proxy service name.
- getLog: Gets the log details. Expects target. 
- updateCryptoKey: Updates crypto key. Expects the following options
```
{
  name: <key name>,
  fileName: <file name>,
  password: <password>,
  passwordAlias: <passwordAlias>
}
```
- updateCryptoCertificate: Updates crypto certificate. Expects the following options
```
{
  name: <name>,
  fileName: <fileName>,
  password: <password>,
  passwordAlias: <password Alias>
}
```
- updateWebserviceHttpsHandler: Updates webservice proxy https handler address. Expects the following options
 ```
 {
  name: <name>,
  address: <address>,
  port: <port>
  
 }
 ```
- updateWebServiceRemoteDetails: Updates webservice proxy remote address details. Expects the following options
```
{
  name: <name>,
  comment: <comment>,
  servicePort: <service port>,
  protocol: <protocol>,
  host: <host>,
  port: <port>,
  uri: <uri>
}
```

## Util Helpers

- saveFileWithBase64 : Saves a file with base64 content. It decodes base64 content to bytes and saves. Expects filePath and base64Data
- readFileAsBase64 : Reads a file as base64 content. It reads content from file and encodes as base64. 

## Note

The current API is still in development. I have covered basic functionality and most of the config types. If you need particular function, please feel free to modify and let me know, I will add them.

## How to use

Please see below examples

### Install DataPowerAPI
```
npm install --save datapowerapi

```
### Initialize DataPower Api
```
const DataPower = require('datapowerapi');

const localConfig={
    endpoint: 'https://127.0.0.1:5550',
    username: 'admin',
    password: 'admin'
}
const xmlApi = new DataPower.XmlApi(localConfig); 

```
### Get all domains
```
const DataPower = require('datapowerapi');

const localConfig={
    endpoint: 'https://127.0.0.1:5550',
    username: 'admin',
    password: 'admin'
}
const xmlApi = new DataPower.XmlApi(localConfig); 

getDomains();

async function getDomains()
{
    let domains = await xmlApi.getDomains();

    console.log(domains);

}

```
### Switch domains 
```
const DataPower = require('datapowerapi');

const localConfig={
    endpoint: 'https://127.0.0.1:5550',
    username: 'admin',
    password: 'admin'
}
const xmlApi = new DataPower.XmlApi(localConfig); 

domainTest();
async function domainTest()
{
    //from current domain to testing
    xmlApi.switchDomain('testing');

    let testServices = await xmlApi.getWebServices();
    console.log(testServices);
    
    //from testing to default
    xmlApi.switchDomain('default');

    let defaultServices = await xmlApi.getWebServices();
    console.log(defaultServices);

}

```
### Get statuses of All objects
```
const DataPower = require('datapowerapi');

const localConfig={
    endpoint: 'https://127.0.0.1:5550',
    username: 'admin',
    password: 'admin'
}
const xmlApi = new DataPower.XmlApi(localConfig); 

getStatuses();

async function getStatuses()
{
    let statuses = await xmlApi.getObjectStatuses();

    console.log(statuses);
}
```
### Export a domain
```
const DataPower = require('datapowerapi');
const localConfig={
    endpoint: 'https://127.0.0.1:5550',
    username: 'admin',
    password: 'admin'
}
const xmlApi = new DataPower.XmlApi(localConfig); 

exportDomain();

async function exportDomain()
{
    let domainZip = await xmlApi.exportDomain({
        domain: 'default' 
        // default is ZIP, to export in XML, use proprty format: 'Xml'
    });
    console.log(domainZip);
}

```

### Copy domain(s) from one host to another
```
const DataPower = require('datapowerapi');

const sourceConfig={
    endpoint: 'https://127.0.0.1:5550',
    username: 'admin',
    password: 'admin'
}
const targetConfig={
    endpoint: 'https://targetdatapower.com:5550',
    username: 'admin',
    password: 'admin'
}

const sourceApi = new DataPower.XmlApi(sourceConfig); 
const targetApi = new DataPower.XmlApi(targetConfig); 

copyDomain();

async function copyDomain()
{
    let sourceDomainName = 'default';
    let targetDomainName = 'testing';

    let sourceDomains = await sourceApi.getDomains();
    if(sourceDomains.indexOf(sourceDomainName)<0)
    {
      console.error(sourceDomainName+' doesnt exist in source...');
      return;
    }

    let targetDomains = await targetApi.getDomains();

    if(targetDomains.indexOf(targetDomainName)<0)
    {
      console.error(targetDomainName+' doesnt exist in target..., creating ');
      
      let newDomain = await targetApi.createDomain({
        domain: targetDomainName,
        comment: "Imported from XML API"
      });

      if (!newDomain) {
        console.error("Cannot create domain " + targetDomainName + ", skipping");
        return;
      }
    }

    let sourceDomain = await sourceApi.exportDomain({
        domain: sourceDomainName
        // default is ZIP, to export in XML, use proprty format: 'Xml'
    });

    if(sourceDomain.success)
    {
        targetApi.switchDomain(targetDomainName);

        let targetDomain = await targetApi.importDomain({
            domain:targetDomainName,
            content: sourceDomain.content
        });

        if(targetDomain.success)
        {
            console.log("Domain imported successfully");
            //save the config
            targetDomain.saveConfig();
        }
        else
        {
            console.error("Cannot import domain " + targetDomainName + ", errors ", targetDomain.success);
            return;
        }
    }
    else
    {
        console.error("Cannot copy domain, error is ", sourceDomain.errors);
    }
    console.log(sourceDomain);
}

```
