const DataPowerObjectTypes = require("./datapowerenums").DataPowerObjectTypes;

class DPObject{
    xmlObject = {};
    timeStamp = "";
    objectName = "";
    constructor(objectName)
    {
        this.objectName = objectName || "";
    }

}


class DPResult extends DPObject{
    result = "";

    constructor(result)
    {
        super(DataPowerObjectTypes.DPResult);
        this.result = result || "";
    }

}

class DPFileStore extends DPObject
{
    fileDirectories = [];
    constructor(fileDirectories)
    {
        super(DataPowerObjectTypes.DPFileStore);
        this.fileDirectories = fileDirectories;
    }

    getFileDirectory(name)
    {
        let directory;
        if(name && this.fileDirectories && this.fileDirectories.length>0)
        {
            directory = this.fileDirectories.find(directory => {
              
                return directory.name == name;
            })
        }
        return directory;
    }

}

class DPFileDirectory extends DPObject
{
    name = "";
    canRead = false;
    canWrite = false;
    canLog = false;
    canDelete = false;
    isList = false;
    files = [];
    

    constructor(name, files, read, write, log, del, list)
    {
        super(DataPowerObjectTypes.DPFileDirectory);
        this.name = name || "";
        this.files = files || [];
        this.canRead = read || false;
        this.canWrite = write || false;
        this.canLog = log || false;
        this.canDelete = del || false;
        this.isList = list || false;
    }

}


class DPFile extends DPObject
{
    directory = "";
    name = "";
    size = 0;
    modified = "";
    contents;
    constructor(directory,name, size, modified, contents)
    {
        super(DataPowerObjectTypes.DPFile);
        this.name = name || "";
        this.size = size || 0;
        this.modified = modified || "";
        this.contents = contents || "";
        this.directory = directory || "";
    }

    get filePath()
    {
        let path;

        if(this.directory && this.name)
        {
            path = this.directory +":///"+this.name;
        }
        return path;
    }
}

class DPLogEntry extends DPObject
{
    date = "";
    time = "";
    dateTime="";
    type="";
    class="";
    object="";
    level="";
    transactionType="";
    transaction="";
    grid="";
    client="";
    code="";
    file="";
    message="";
}

class DPLog extends DPObject
{
    logEntries = [];
}

module.exports={
    DPObject : DPObject,
    DPResult: DPResult,
    DPFile: DPFile,
    DPFileDirectory : DPFileDirectory,
    DPFileStore: DPFileStore,
    DPLogEntry: DPLogEntry,
    DPLog: DPLog
}