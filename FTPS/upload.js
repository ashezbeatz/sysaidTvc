const Client = require('ftp');
const fs = require('fs');
require('dotenv').config();
// Set up the connection options
const config = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  secure: true // Enable secure FTP (FTPS)
};

// Create a new FTP client
const client = new Client();

// Connect to the server
client.connect(config);

// Wait for the connection to be established
client.on('ready', () => {
  console.log('Connected to FTP server');

  // Get a list of files in the local folder
  fs.readdir(`${process.env.local_dir}`, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Upload each file to the server
    files.forEach((file) => {
      // Read the local file to be uploaded
      const fileContents = fs.createReadStream(`${process.env.local_dir}/${file}`);

      // Upload the file to the server
      client.put(fileContents, `${process.env.remote_dir}${file}`, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`File "${file}" uploaded successfully`);

          // Move the file to the "done" folder
          fs.rename(`${process.env.local_dir}/${file}`, `${process.env.local_dir}/${file}`, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`File "${file}" moved to "done" folder`);
            }
          });
        }
      });
    });

    // Close the connection to the server
    client.end();
  });
});

// Handle any errors that occur
client.on('error', (err) => {
  console.error(err);
});