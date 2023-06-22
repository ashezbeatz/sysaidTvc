const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');
const warCheckerData = require('./models/warcheckqueries')
const WebLogicAPI = require('./weblogic/WebLogicAPI')
const CryptoJS = require("crypto-js");
const cron = require('node-cron');
require("dotenv").config();
//const WebLogicAppInfo = require('./weblogic/weblogicchecker')

// Create a log directory path
const logDirectory = path.join(__dirname, 'logs');

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Define the log file name
const logFileName = 'app-%DATE%.log';

// Define the log file path
const logFilePath = path.join(logDirectory, logFileName);

// Configure the logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winstonDailyRotateFile({
            filename: logFilePath,
            datePattern: 'YYYY-MM-DD',
            maxSize: '500m',
            maxFiles: '14d',
        })
    ]
});
// let data = warCheckerData.checkData();

// console.log(data);

// for (const row of data) {
//     console.log(row.acdc_url);
// }
console.log("app started......")
    // Replace the console.log statement
logger.info("App started...");
const secretKey = "XkhZG4fW2t2W";
//tab 1


cron.schedule(`${process.env.corntab}`, () => {
    //staerted
    logger.info("-------Job 1 started-----");
    console.log(`Task running every 5 minutes ${process.env.corntab}`);
    logger.info(`Task running every 5 minutes ${process.env.corntab}`);;
    warCheckerData.checkData5m().then(async rows => {
        for (const row of rows) {
            console.log(row.acdc_password)
            console.log(row.acdc_url)
            console.log(row.acdc_username)
            console.log(row.cluster_name)
            console.log(row.teamid)
            console.log(row.id)
            logger.info(row.acdc_password);
            logger.info(row.acdc_url);
            logger.info(row.acdc_username);
            logger.info(row.cluster_name);
            logger.info(row.teamid);
            logger.info(row.id);
            // and so on...
            let acdspass;
            let lcdspass;
            await warCheckerData.updateConfigs(row.id);
            const result = decryptData(row.acdc_password, secretKey)
            if (result.success) {
                console.log("Decryption successful. Decrypted data:", result.data);
                logger.info("Decryption successful. Decrypted data:", result.data);

                acdspass = result.data
            } else {
                acdspass = row.acdc_password
                logger.error("Decryption failed. Error:", acdspass);
                console.error("Decryption failed. Error:", acdspass);
            }
            const result2 = decryptData(row.ladc_password, secretKey)
            if (result2.success) {
                console.log("Decryption successful. Decrypted data:", result.data);
                logger.info("Decryption successful. Decrypted data:", result2.data);

                lcdspass = result2.data
            } else {
                lcdspass = row.ladc_password
                console.error("Decryption failed. Error:", lcdspass);
                logger.error("Decryption failed. Error:", lcdspass);
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
                    logger.info(`ACDC list: ${appList}`);
                })
                .catch((err) => {
                    console.error(`
                                        Failed to get Primary deployed applications: $ { err }
                                        `);
                    logger.error(`Failed to get Primary deployed applications: ${err}`);
                });
            console.log("secondary")
                //secondary
            const ldcweblogic = new WebLogicAPI(ladc_url, ladc_username, ladc_password, cluster_name, teamid, location2)
            await ldcweblogic.getDeployedApplications()
                .then((appList) => {
                    console.log(`ldc list ${appList}`);
                    logger.info(`LDC list: ${appList}`);
                    logger.error(`Failed to get Secondary deployed applications: ${err}`);
                })
                .catch((err) => {
                    console.error(`
                                        Failed to get Secondary deployed applications: $ { err }
                                        `);
                });

            //  await warCheckerData.updateConfigs(row.id);
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

    logger.info("-------Job 1 Ended-----");
    //end
});



//schuduler 2
cron.schedule(`${process.env.corntab2}`, () => {
    //staerted
    console.log("---------jobs 2------")
    logger.info("---------jobs 2 started------")
    console.log('Task running every 30 minutes');
    logger.info(`Task running twice --- ${process.env.corntab2}`);

    warCheckerData.checkData().then(async rows => {
        for (const row of rows) {
            console.log(row.acdc_password)
            console.log(row.acdc_url)
            console.log(row.acdc_username)
            console.log(row.cluster_name)
            console.log(row.teamid)
            logger.info(row.acdc_password);
            logger.info(row.acdc_url);
            logger.info(row.acdc_username);
            logger.info(row.cluster_name);
            logger.info(row.teamid);
            // and so on...
            let acdspass;
            let lcdspass;
            const result = decryptData(row.acdc_password, secretKey)
            if (result.success) {
                console.log("Decryption successful. Decrypted data:", result.data);
                logger.info("Decryption successful. Decrypted data:", result.data);

                acdspass = result.data
            } else {
                acdspass = row.acdc_password
                logger.error("Decryption failed. Error:", acdspass);
                console.error("Decryption failed. Error:", acdspass);
            }
            const result2 = decryptData(row.ladc_password, secretKey)
            if (result2.success) {
                console.log("Decryption successful. Decrypted data:", result.data);
                logger.info("Decryption successful. Decrypted data:", result2.data);

                lcdspass = result2.data
            } else {
                lcdspass = row.ladc_password
                console.error("Decryption failed. Error:", lcdspass);
                logger.error("Decryption failed. Error:", lcdspass);
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
                    logger.info(`ACDC list: ${appList}`);
                })
                .catch((err) => {
                    console.error(`
                                        Failed to get Primary deployed applications: $ { err }
                                        `);
                    logger.error(`Failed to get Primary deployed applications: ${err}`);
                });
            console.log("secondary")
                //secondary
            const ldcweblogic = new WebLogicAPI(ladc_url, ladc_username, ladc_password, cluster_name, teamid, location2)
            await ldcweblogic.getDeployedApplications()
                .then((appList) => {
                    console.log(`ldc list ${appList}`);
                    logger.info(`LDC list: ${appList}`);
                    logger.error(`Failed to get Secondary deployed applications: ${err}`);
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

    logger.info("---------jobs 2 ended------")
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