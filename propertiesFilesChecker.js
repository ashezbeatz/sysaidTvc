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



function getFiles(directory) {
    let fileList = [];

    function traverseDirectory(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                traverseDirectory(filePath); // Recursively traverse subdirectories
            } else if (stats.isFile()) {
                fileList.push(filePath);
            }
        });
    }

    traverseDirectory(directory);

    return fileList;
}

async function calculateChecksum(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);

        stream.on('error', reject);
        stream.on('data', data => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

async function keepMostUpToDate(files) {
    const fileMap = {};

    for (const file of files) {
        const fileNameWithoutExt = path.parse(file).name;
        // console.log("file name " + path.basename(file));
        const stats = await fs.promises.stat(file);
        const fileSize = stats.size;
        const fileCreatedTime = stats.birthtime;
        const fileModifiedTime = stats.mtime;
        const fileChecksum = await calculateChecksum(file);

        if (!fileMap[fileNameWithoutExt] || fileMap[fileNameWithoutExt].modifiedTime < fileModifiedTime) {
            fileMap[fileNameWithoutExt] = {
                fileName: fileNameWithoutExt,
                filePath: file,
                size: fileSize,
                createdTime: formatDate(fileCreatedTime),
                modifiedTime: formatDate(fileModifiedTime),
                checksum: fileChecksum,
                fileNamewithExt: path.basename(file),
            };
        }
    }

    return Object.values(fileMap);
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

function processURL2(url) {
    let processedURL = url.replace(/^https?:\/\//, ''); // Remove "http://" or "https://"
    let [host, port] = processedURL.split(':'); // Split host and port if present

    // Add name or IP logic here (e.g., replace "host" with the desired value)

    return { host, port };
}

function processURL(url) {
    let processedURL = url.replace(/^https?:\/\//, ''); // Remove "http://" or "https://"
    let [host, portAndPath] = processedURL.split(':'); // Split host and port with path if present

    let [port, path] = portAndPath.split('/'); // Split port and path

    // Add name or IP logic here (e.g., replace "host" with the desired value)

    return { host, port, path };
}
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

console.log(`host : ${host} : port ${port}`)

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

//api posting
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

function makeRequest(formData) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            uri: `${process.env.apiendpoint}/api/getPropsData`,
            formData: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            json: true
        };

        rp(options)
            .then(response => {
                console.log('Response:', response);
                logger.info('Response:', response);
                resolve(response);
            })
            .catch(error => {
                console.error('Error:', error);
                logger.error('Error:', error);
                reject(error);
            });
    });
}
const directoryPath = JSON.parse(process.env.JSON_PATH_DATA);

console.log(directoryPath.data);
const paths = directoryPath.data;
async function main() {

    paths.forEach(async(path) => {
        // Perform an action for each path
        console.log("Processing path:", path);
        logger.info(`Processing path: ${path}`)
            // ... do something with the path
        const allFiles = getFiles(path);
        console.log("Processing  file path:", allFiles);
        const deduplicatedFiles = await keepMostUpToDate(allFiles);
        const info = getMachineInfo();
        const ipaddress = info.ipAddresses ? info.ipAddresses : process.env.serverip
        const server_ports = process.env.serverport ? process.env.serverport : '7001'
        deduplicatedFiles.forEach(fileInfo => {
            logger.info("-------------------------------")
            console.log(`File Name: ${fileInfo.fileName}`);
            console.log(`File: ${fileInfo.filePath}`);
            console.log(`Size: ${fileInfo.size} bytes`);
            console.log(`Created: ${fileInfo.createdTime}`);
            console.log(`Modified: ${fileInfo.modifiedTime}`);
            console.log(`Checksum: ${fileInfo.checksum}`);
            console.log(`ipAdress: ${ipaddress}`);
            console.log(`File name with extension: ${fileInfo.fileNamewithExt}`);
            console.log('-------------------------');

            /* const fileData = {
                 file: fs.createReadStream(fileInfo.filePath)
             };
             const jsonData = {
                 "ipaddress": `${ipaddress}`,
                 "location": `${process.env.partition}`,
                 "appname": fileInfo.fileName,
                 "port": `${server_ports}`,
                 "size": fileInfo.size,
                 "deploymentTime": fileInfo.createdTime,
                 "updateTime": fileInfo.modifiedTime,
                 "checkSum": fileInfo.checksum
             }*/
            const fileExtension = fileInfo.fileNamewithExt.split('.').pop().toLowerCase();
            if (fileExtension === 'txt' || fileExtension === 'properties') {

                console.log("tat :" + fileInfo.fileName)
            }
            const formData = {
                jsonData: JSON.stringify({
                    ipaddress: ipaddress.toString(),
                    location: process.env.partition,
                    appname: fileInfo.fileName,
                    port: server_ports,
                    size: fileInfo.size,
                    deploymentTime: fileInfo.createdTime,
                    updateTime: fileInfo.modifiedTime,
                    checkSum: fileInfo.checksum
                }),
                file: fs.createReadStream(fileInfo.filePath)
            };


            console.log('Posting to API:------------');
            logger.info('Posting to API:------------');
            makeRequest(formData)
                .then(response => {
                    // Handle the response
                    console.log('Response:', response);
                    logger.info('Response:', response);
                })
                .catch(error => {
                    // Handle the error
                    console.error('Error:', error);
                    logger.error('Error:', error);
                });
            /* postJSONData(jsonData)
                 .then(response => {
                     console.log('Response:', response);
                     logger.info('Response:', response);
                     // Use the response as needed
                 })
                 .catch(error => {
                     console.error('Error:', error);
                     logger.error('Error:', error);
                     // Handle the error
                 });*/

        });

    });

}


main();