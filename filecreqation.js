const fs = require('fs');
const path = require('path');

const folderName = 'newFolder';
const folderPath = path.join(process.cwd(), folderName);

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log('Folder created successfully.');
} else {
    console.log('Folder already exists.');
}



async function processFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    const result = []; // Array to store all file information
    const currentFiles = []; // Array to store current (non-duplicate) file information

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            const checksum = await getChecksum(filePath);
            const fileNameWithExtension = path.basename(filePath);
            const fileName = path.parse(fileNameWithExtension).name;
            const { size, birthtime, mtime } = stat;

            const fileData = {
                filePath,
                fileNameWithExtension,
                fileName,
                size: formatSize(size),
                birthtime,
                mtime: formatDate(mtime),
                newDate: formatDate(birthtime),
                checksum
            };

            result.push(fileData); // Add file information to the array

            // Check for duplicates
            const duplicates = result.filter(f => f.fileName === fileName && f.size === formatSize(size));
            if (duplicates.length > 1) {
                // Sort duplicates by date (mtime) in descending order
                duplicates.sort((a, b) => b.mtime - a.mtime);

                // Add the file with the latest date (current file) to the separate array
                currentFiles.push(duplicates[0]);
            } else {
                currentFiles.push(fileData); // Add the current (non-duplicate) file to the separate array
            }

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

        } else if (stat.isDirectory()) {
            const subfolderFiles = await processFolder(filePath); // Recursively process subfolders
            result.push(...subfolderFiles); // Add files from subfolders to the array
        }
    }

    return currentFiles; // Return the array of current (non-duplicate) file information
}



const data = processFolder('/Users/mac/Desktop/untitled folder 2/Output')