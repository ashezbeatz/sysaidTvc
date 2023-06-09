const ftp = require('ftp');

const ftpHost = '10.14.1.221';
const ftpPort = 22; // FTPS default port
const ftpUser = 'seguceout';
const ftpPass = 'keeptRy1n9';

const client = new ftp();

client.on('ready', () => {
    console.log('FTPs connection is successful');
    client.end();
});

client.on('error', (err) => {
    console.log('Failed to establish FTP connection. Error:', err);
});

const config = {
    host: ftpHost,
    port: ftpPort,
    user: ftpUser,
    password: ftpPass,
    secure: true, // Enable FTPS
};

client.connect(config);