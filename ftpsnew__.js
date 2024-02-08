const FTPS = require('ftps');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

console.log("ASDasda" + process.env.FTP_HOST)
const ftpsConfig = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    username: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    protocol: 'ftps',
    additionalLftpCommands: ['-e', 'set ftp:ssl-force true'],
};

const ftps = new FTPS(ftpsConfig);

const localDirectoryPath = `${process.env.local_dir}`; // Replace with your directory path

function uploadFilesFromDirectory(localDirectoryPath, remoteDirectoryPath) {
    fs.readdir(localDirectoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const localFilePath = path.join(localDirectoryPath, file);
            const remoteFilePath = path.join(remoteDirectoryPath, file);

            ftps.put(localFilePath, remoteFilePath).exec((uploadErr, res) => {
                if (uploadErr) {
                    console.error(`Error uploading file ${localFilePath}:`, uploadErr);
                } else {
                    console.log(`File ${localFilePath} uploaded successfully:`, res);
                }
            });
        });
    });
}

const remoteDirectoryPath = `${process.env.remote_dir}`; // Replace with your remote directory path

uploadFilesFromDirectory(localDirectoryPath, remoteDirectoryPath);