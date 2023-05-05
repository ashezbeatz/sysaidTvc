const fs = require('fs');
const path = require('path');
require("dotenv").config();
const folderPath = `${process.env.folderPaths}`;
console.log(folderPath);

// Get all folder names from the given path
const getFolderNames = async(dirPath) => {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return dirents.filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
};

// Get the total number of directories in a given directory
const getTotalDirsInDir = async(dirPath) => {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    let totalDirs = 0;
    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            totalDirs++;
        }
    }
    return totalDirs;
};

// Divide files by the number of folders and move to each folder
const divideFilesByFolders = async(filePath, folderNames) => {
    const allFiles = await fs.promises.readdir(filePath);
    const files = allFiles.filter(file => fs.lstatSync(path.join(filePath, file)).isFile());
    const filesPerFolder = Math.ceil(files.length / folderNames.length);

    for (let i = 0; i < folderNames.length; i++) {
        const folderName = folderNames[i];
        const folderPath = path.join(filePath, folderName);
        if (!fs.existsSync(folderPath)) {
            //  fs.mkdirSync(folderPath);
        }

        const startIndex = i * filesPerFolder;
        const endIndex = Math.min(startIndex + filesPerFolder, files.length);

        for (let j = startIndex; j < endIndex; j++) {
            const fileName = files[j];
            const sourcePath = path.join(filePath, fileName);
            const destPath = path.join(folderPath, fileName);
            await fs.promises.rename(sourcePath, destPath);
        }
    }
};

// Move files to folders
const moveFilesToFolders = async() => {
    const folderNames = await getFolderNames(folderPath);
    await divideFilesByFolders(folderPath, folderNames);
};

//moveFilesToFolders();
module.exports = moveFilesToFolders;