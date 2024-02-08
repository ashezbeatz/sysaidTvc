const Client = require('ftp-client');
const fs = require('fs');

const config = {
    host: 'demo.wftpserver.com',
    port: 990,
    user: 'demo',
    password: 'demo',
    secure: true, // Use secure connection
    secureOptions: { rejectUnauthorized: false }, // Adjust as needed
    requireTLS: true // Force TLS connection
};

const client = new Client(config);

client.connect(function() {
    console.log('Connected to FTP server');

    // Change remote directory
    client.cd('/upload', function() {
        console.log('Changed directory');

        // Upload a file
        const localFilePath = '/Users/mac/desktop/even/backkkk/New folder/commons-net-3.6.jar';
        const remoteFileName = 'remote-commons-net-3.6.jar';

        client.upload(fs.createReadStream(localFilePath), remoteFileName, function(err, res) {
            if (err) {
                console.error('Error uploading file:', err);
            } else {
                console.log('File uploaded successfully:', res);
            }

            // Close the connection
            client.close(function() {
                console.log('Disconnected from FTP server');
            });
        });
    });
});