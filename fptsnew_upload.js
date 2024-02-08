const fs = require('fs');
const ftp = require('ftp');

const client = new ftp();

client.on('ready', () => {
    console.log('Connected to FTP server');

    // Specify the local directory you want to upload
    const localDir = '/Users/mac/desktop/even/backkkk/New folder/';

    // List files in the local directory
    fs.readdir(localDir, (err, files) => {
        if (err) throw err;

        // Iterate through the files
        files.forEach((file) => {
            const localPath = localDir + file;
            const remotePath = '/upload/' + file; // Adjust the remote folder as needed

            // Upload each file
            client.put(localPath, remotePath, (err) => {
                if (err) throw err;
                console.log(`File ${file} uploaded`);
            });
        });

        // Disconnect after uploading all files
        client.end();
    });
});

client.connect({
    host: 'demo.wftpserver.com',
    user: 'demo',
    password: 'demo',
    port: 990,
    secure: true, // Enable FTP over TLS
});

client.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});