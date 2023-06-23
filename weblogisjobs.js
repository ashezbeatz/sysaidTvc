const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cron = require('node-cron');
const rp = require('request-promise');
const os = require('os');
const net = require('net');
require("dotenv").config();

// Create a log directory path
const logDirectory = path.join(process.cwd(), 'logs');

// Create the log directory if it doesn't exist
// if (!fs.existsSync(logDirectory)) {
//     fs.mkdirSync(logDirectory);
// }
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
    console.log('Folder created successfully.');
} else {
    console.log('Folder already exists.');
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

function getChecksum(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);

        stream.on('error', reject);

        stream.on('data', (data) => {
            hash.update(data);
        });

        stream.on('end', () => {
            const checksum = hash.digest('hex');
            resolve(checksum);
        });
    });
}


async function processFolder(folderPath) {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            const checksum = await getChecksum(filePath);
            const fileNameWithExtension = path.basename(filePath);
            const fileName = path.parse(fileNameWithExtension).name;
            const { size, birthtime, mtime } = stat;
            console.log(`File: ${filePath}`);
            logger.info(`File: ${filePath}`);
            console.log(`File Name with extension: ${path.basename(filePath)}`);
            logger.info(`File Name with extension: ${path.basename(filePath)}`);
            console.log(`File Name : ${fileName}`);
            logger.info(`File Name : ${fileName}`);

            console.log(`Size: ${formatSize(size)} bytes`);
            logger.info(`Size: ${formatSize(size)} bytes`);
            console.log(` created Date: ${birthtime}`);
            logger.info(` created Date: ${birthtime}`);
            console.log(` updated Date: ${formatDate(mtime)}`);
            logger.info(` updated Date: ${formatDate(mtime)}`);
            console.log(`New Date: ${formatDate(birthtime)}`);
            logger.info(`New Date: ${formatDate(birthtime)}`);
            console.log(`Checksum: ${checksum}`);
            logger.info(`Checksum: ${checksum}`);
            console.log('---');
            const info = getMachineInfo();
            const ipaddress = info.ipAddresses ? info.ipAddresses : process.env.serverip
            const jsonData = {
                "ipaddress": `${ipaddress}`,
                "location": `${process.env.partition}`,
                "appname": fileName,
                "port": `${process.env.serverport}`,
                "size": size,
                "deploymentTime": formatDate(birthtime),
                "updateTime": formatDate(mtime),
                "checkSum": checksum
            }
            console.log('Posting to API:------------');
            logger.info('Posting to API:------------');
            postJSONData(jsonData)
                .then(response => {
                    console.log('Response:', response);
                    logger.info('Response:', response);
                    // Use the response as needed
                })
                .catch(error => {
                    console.error('Error:', error);
                    logger.debug('Error:', error);
                    // Handle the error
                });
        } else if (stat.isDirectory()) {
            await processFolder(filePath); // Recursively process subfolders
        }
    }
}


async function postJSONData(data) {
    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        rp.put({
            url: `${process.env.apiendpoint}/api/configurations/appsNewUpdate`,
            body: data,
            json: true,
            headers: headers
        }, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

function formatSize(sizeInBytes) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];

    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getServerInfo() {
    // Get server name (hostname)
    const serverName = os.hostname();

    // Get IP addresses
    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = [];

    Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddresses.push(iface.address);
            } else {
                ipAddresses.push(iface.address);
            }
        });
    });

    return {
        serverName,
        ipAddresses,
    };
}

function getMachineInfo() {
    const machineName = os.hostname();
    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = [];

    Object.values(networkInterfaces).forEach(interfaces => {
        interfaces.forEach(interfaceData => {
            if (interfaceData.family === 'IPv4' && !interfaceData.internal) {
                ipAddresses.push(interfaceData.address);
            }
        });
    });

    return {
        machineName,
        ipAddresses
    };
}
async function getMachineInfo2() {
    const networkInterfaces = os.networkInterfaces();
    const machineInfo = {};

    if (Object.keys(networkInterfaces).length === 0) {
        machineInfo.type = 'Local Machine';
    } else {
        const interfaceNames = Object.keys(networkInterfaces);
        const firstInterface = networkInterfaces[interfaceNames[0]][0];
        const ipAddress = firstInterface.address;

        machineInfo.type = 'Server';
        machineInfo.ipAddress = ipAddress;
    }

    machineInfo.name = os.hostname();

    return machineInfo;
}

function processURL(url) {
    let processedURL = url.replace(/^https?:\/\//, ''); // Remove "http://" or "https://"
    let [host, port] = processedURL.split(':'); // Split host and port if present

    // Add name or IP logic here (e.g., replace "host" with the desired value)

    return { host, port };
}

///cronjobs

//telnet 
function telnet(ipAddress, port) {
    return new Promise((resolve, reject) => {
        const socket = net.createConnection(port, ipAddress);

        socket.on('connect', () => {
            console.log(`Telnet connection successful: ${ipAddress}:${port}`);
            logger.info(`Telnet connection successful: ${ipAddress}:${port}`);
            resolve(socket); // Resolve the Promise with the socket object
        });

        socket.on('error', (err) => {
            reject(err); // Reject the Promise with the error
            logger.error("error occuried" + err)
        });

        socket.on('end', () => {
            console.log('Telnet connection closed');
            logger.error("Telnet connection closed")
        });
    });
}
const { host, port } = processURL(`${process.env.apiendpoint}`)

// const serverInfo = getServerInfo();
// console.log('Server Name:', serverInfo.serverName);
// console.log('IP Addresses:', serverInfo.ipAddresses);

const info = getMachineInfo();
console.log('Machine Name:', info.machineName);
console.log('Machine Type:', info.ipAddresses);
console.log("-------------------------------")
console.log('Server Name:', info.machineName);
console.log('IP Addresses:', info.ipAddresses);
console.log("-------------------------------")
logger.info("-------------------------------")
logger.info('Server Name:', info.machineName);
logger.info('IP Addresses:', info.ipAddresses);
logger.info('Machine Name:', info.machineName);
logger.info('Machine Type:', info.ipAddresses);
logger.info("-------------------------------")


//schuduler 2
//cron.schedule(`${process.env.corntab}`, () => {
const folderPath = `${process.env.weblogicpath}`; // Replace with the actual folder path

console.log('Task running every 5 minutes');
console.log("----------------check connection---------------")
logger.info("----------------checking connection---------------")
telnet(host, port)
    .then((socket) => {
        // Telnet connection successful, now call your desired function
        // myFunction(socket);
        processFolder(folderPath);
    })
    .catch((error) => {
        console.error('Test connection error:', error);
        logger.error(`Test connection error: ${error}`)
    });
//});
//
console.log("-------------------------------")
console.log('Server Name:', info.machineName);
console.log('IP Addresses:', info.ipAddresses);
console.log("-------------------------------")
logger.info("-------------------------------")
logger.info('Server Name:', info.machineName);
logger.info('IP Addresses:', info.ipAddresses);
logger.info('Machine Name:', info.machineName);
logger.info('Machine Type:', info.ipAddresses);
logger.info("-------------------------------")