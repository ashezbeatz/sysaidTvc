const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cron = require('node-cron');
const rp = require('request-promise');
require("dotenv").config();

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

async function processFolder2(folderPath, name, type, version) {

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
            console.log(`File Name with extension: ${path.basename(filePath)}`);
            console.log(`File Name : ${fileName}`);

            console.log(`Size: ${formatSize(size)} bytes`);
            console.log(` created Date: ${birthtime}`);
            console.log(` updated Date: ${formatDate(mtime)}`);
            console.log(`New Date: ${formatDate(birthtime)}`);
            console.log(`Checksum: ${checksum}`);
            console.log('---');
            const jsonData = {
                "name": name,
                "location": type,
                "appname": fileName,
                "teamId": version,
                "size": size,
                "deploymentTime": formatDate(birthtime),
                "updateTime": formatDate(mtime),
                "checkSum": checksum
            }
            console.log('Posting to API:------------');
            postJSONData(jsonData)
                .then(response => {
                    console.log('Response:', response);
                    // Use the response as needed
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle the error
                });

        } else if (stat.isDirectory()) {
            await processFolder2(filePath, name, type, version); // Recursively process subfolders
        }
    }
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
            console.log(`File Name with extension: ${path.basename(filePath)}`);
            console.log(`File Name : ${fileName}`);

            console.log(`Size: ${formatSize(size)} bytes`);
            console.log(` created Date: ${birthtime}`);
            console.log(` updated Date: ${formatDate(mtime)}`);
            console.log(`New Date: ${formatDate(birthtime)}`);
            console.log(`Checksum: ${checksum}`);
            console.log('---');
        } else if (stat.isDirectory()) {
            await processFolder(filePath); // Recursively process subfolders
        }
    }
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

async function callApi(url) {
    try {
        const response = await rp(url);
        // Process the response data here
        // console.log(response);
        return JSON.parse(response);
    } catch (error) {
        // Handle error
        console.error('Error:', error);
    }
}

async function fetchDataFromAPI() {
    return new Promise((resolve, reject) => {
        rp.get(`${process.env.apiendpoint}/api/configurations/get${process.env.partition}/${process.env.serverip}:${process.env.serverport}`, (error, response, body) => {
            if (error) {
                reject(error); // Reject the promise with the error
            } else {
                try {
                    const data = JSON.parse(body);
                    resolve(data); // Resolve the promise with the API response data
                } catch (parseError) {
                    reject(parseError); // Reject the promise if there is an error parsing the JSON
                }
            }
        });
    });
}

async function postJSONData(data) {
    const headers = {
        'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
        rp.put({
            url: `${process.env.apiendpoint}/api/configurations/appsUpdate`,
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

async function postJSONData2(data, callback) {
    const headers = {
        'Content-Type': 'application/json'
    };

    request.put({
        url: `${process.env.apiendpoint}/api/configurations/appsUpdate`,
        body: data,
        json: true,
        headers: headers
    }, function(error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, body);
        }
    });
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
const apiUrl = `
${process.env.apiendpoint}/api/configurations/get${process.env.partition}/${process.env.serverip}:${process.env.serverport}`; // Replace with the actual API URL
//const data = callApi(apiUrl);

//console.log("response" + data)


const folderPath = `${process.env.weblogicpath}`; // Replace with the actual folder path
//processFolder(folderPath);


async function processData() {
    try {
        const response = await fetchDataFromAPI();
        let folderPath = `${process.env.weblogicpath}`;
        response.forEach(item => {
            const id = item[0];
            const name = item[1];
            const category = item[2];
            const version = item[3];
            const status = item[4];
            const url = item[5];
            const username = item[6];
            const password = item[7];
            const type = item[8];

            console.log(`ID: ${id}`);
            console.log(`Name: ${name}`);
            console.log(`Category: ${category}`);
            console.log(`team: ${version}`);
            console.log(`Status: ${status}`);
            console.log(`URL: ${url}`);
            console.log(`Username: ${username}`);
            console.log(`Password: ${password}`);
            console.log(`Type: ${type}`);
            console.log('---');

            processFolder2(folderPath, name, type, version);
        });
    } catch (error) {
        console.error('Error fetching data from the API:', error);
    }
}
console.log('---');
processData();
console.log('---');
//processFolder(folderPath);