const warCheckerData = require('./models/warcheckqueries')
    //const WebLogicAPI = require('./weblogic/WebLogicAPI')
const WebLogicAPIs = require('./weblogic/WebLogicAPIs')
const CryptoJS = require("crypto-js");
const cron = require('node-cron');
require("dotenv").config();


console.log("app started......")
const secretKey = "XkhZG4fW2t2W";
warCheckerData.checkData().then(async rows => {
    for (const row of rows) {
        console.log(row.acdc_password)
        console.log(row.acdc_url)
        console.log(row.acdc_username)
        console.log(row.cluster_name)
        console.log(row.teamid)
            // and so on...
        let acdspass;
        let lcdspass;
        const result = decryptData(row.acdc_password, secretKey)
        if (result.success) {
            console.log("Decryption successful. Decrypted data:", result.data);
            acdspass = result.data
        } else {
            acdspass = row.acdc_password
            console.error("Decryption failed. Error:", acdspass);
        }
        const result2 = decryptData(row.ladc_password, secretKey)
        if (result2.success) {
            console.log("Decryption successful. Decrypted data:", result.data);
            lcdspass = result2.data
        } else {
            lcdspass = row.ladc_password
            console.error("Decryption failed. Error:", lcdspass);
        }
        const acdc_username = row.acdc_username
            //const acdc_url = `${row.acdc_url}/management/weblogic/latest`
        const acdc_url = `${row.acdc_url}`
        const acdc_password = acdspass
        const cluster_name = row.cluster_name
        const teamid = row.teamid
        const location1 = 'primary';
        console.log(acdc_url)
        const weblogicAPI = new WebLogicAPIs(acdc_url, acdc_username, acdc_password);
        await weblogicAPI.fetchApplicationDetails()
            .then(applicationDetails => {
                if (Array.isArray(applicationDetails) && applicationDetails.length > 0) {
                    applicationDetails.forEach(details => {
                        console.log(`Application: ${details.applicationName}`);
                        console.log(`Deployment Date: ${details.deploymentDate}`);
                        console.log(`Deployment Size: ${details.deploymentSize}`);
                        console.log('------------------------------------');
                    });
                } else {
                    console.log('No application details found.');
                }
            })
            .catch(error => {
                console.error(error);
            });
        //secondary
        const ladc_username = row.ladc_username
            // const ladc_url = `${row.ladc_url}/management/weblogic/latest`
        const ladc_url = `${row.ladc_url}`
        const ladc_password = lcdspass
        const location2 = 'Secondary';

    }


}).catch(error => {
    console.log(error)
})


function trimProtocol(url) {
    return url.replace(/^https?:\/\//i, "");
}

function encrypt(message, secretKey) {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
}

function decrypt(ciphertext, secretKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function decryptData(text, secretKey) {
    let data;
    try {
        const bytes = CryptoJS.AES.decrypt(text, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        data = JSON.parse(decryptedText);
        return { success: true, data };
    } catch (error) {

        return { success: false, error };
    }
};