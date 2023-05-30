const warCheckerData = require('./models/warcheckqueries')
const WebLogicAPI = require('./weblogic/WebLogicAPI')
const CryptoJS = require("crypto-js");
const cron = require('node-cron');
//const WebLogicAppInfo = require('./weblogic/weblogicchecker')


// let data = warCheckerData.checkData();

// console.log(data);

// for (const row of data) {
//     console.log(row.acdc_url);
// }
const secretKey = "XkhZG4fW2t2W";
cron.schedule('*/30 * * * *', () => {
    //staerted
    console.log('Task running every 30 minutes');
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
            const acdc_url = row.acdc_url
            const acdc_password = acdspass
            const cluster_name = row.cluster_name
            const teamid = row.teamid
            const location1 = 'primary';

            //secondary
            const ladc_username = row.ladc_username
            const ladc_url = row.ladc_url
            const ladc_password = lcdspass
            const location2 = 'Secondary';

            //primary
            const acdcweblogic = new WebLogicAPI(acdc_url, acdc_username, acdc_password, cluster_name, teamid, location1)
            await acdcweblogic.getDeployedApplications()
                .then((appList) => {
                    console.log(`acdc list ${appList}`);
                })
                .catch((err) => {
                    console.error(`
                                        Failed to get Primary deployed applications: $ { err }
                                        `);
                });
            console.log("secondary")
                //secondary
            const ldcweblogic = new WebLogicAPI(ladc_url, ladc_username, ladc_password, cluster_name, teamid, location2)
            await ldcweblogic.getDeployedApplications()
                .then((appList) => {
                    console.log(`ldc list ${appList}`);
                })
                .catch((err) => {
                    console.error(`
                                        Failed to get Secondary deployed applications: $ { err }
                                        `);
                });


            // const appInfo = new WebLogicAppInfo('t3://localhost:7001', 'weblogic', 'weblogic123', {
            //     host: 'localhost',
            //     user: 'dbuser',
            //     password: 'dbpassword',
            //     database: 'testdb',
            // });



        }
    }).catch(error => {
        console.log(error)
    })


    //end
});


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