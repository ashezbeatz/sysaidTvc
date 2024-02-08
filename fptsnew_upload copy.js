const ftps = require('ftps');

const options = {
    host: 'demo.wftpserver.com',
    port: 990, // Implicit FTPS port
    username: 'demo',
    password: 'demo',
    protocol: 'ftps',
    additionalLftpCommands: 'set ssl:verify-certificate no', // Disable certificate verification (optional)
    additionalFtpFlags: ['-p', '21'], // Specify the port (optional)
};

const ftp = new ftps(options);

ftp.cd('/upload/')
    .exec((response) => {
        console.log(response.error); // Print any error (if occurred)
        console.log(response.data); // Print the response from the server
    });

ftp.raw('ls', ['-l'])
    .exec((response) => {
        console.log(response.error); // Print any error (if occurred)
        console.log(response.data); // Print the response from the server
        console.log(response)
    });

ftp.raw('quit')
    .exec((response) => {
        console.log(response.error); // Print any error (if occurred)
        console.log(response.data); // Print the response from the server
    });