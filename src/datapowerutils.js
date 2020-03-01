/***
 *  DataPower XML management interface API
 *  Author: Raj Bandi (http://www.rajbandi.dev)
 *  Date: 15-Nov-2019
 ***/
const fs = require('fs');

class DataPowerUtils
{
    static saveFileWithBase64(filePath, base64Data)
    {
        fs.writeFileSync(filePath, base64Data, {encoding: 'base64'});
    }

    static readFileAsBase64(filePath)
    {
        return fs.readFileSync(filePath, {encoding:'base64'});
    }
}

module.exports = {
    DataPowerUtils : DataPowerUtils
}