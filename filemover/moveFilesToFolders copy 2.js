const fs = require('fs');
const path = require('path');
require("dotenv").config();
const folderPath = `${process.env.folderPaths}`;
console.log(folderPath);

const getFolderNames = async(dirPath) => {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return dirents.filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
};

const getTotalDirsInDir = async(dirPath) => {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return dirents.filter(dirent => dirent.isDirectory()).length;
}

const divideFilesByFolders = async(filePath, folderNames) => {
    const allFiles = await fs.promises.readdir(filePath);
    const files = allFiles.filter(file => fs.lstatSync(path.join(filePath, file)).isFile());
    const filesPerFolder = Math.ceil(files.length / folderNames.length);

    for (let i = 0; i < folderNames.length; i++) {
        const folderName = folderNames[i];
        const folderPath = path.join(filePath, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        for (let j = i * filesPerFolder; j < (i + 1) * filesPerFolder && j < files.length; j++) {
            const fileName = files[j];
            const sourcePath = path.join(filePath, fileName);
            const destPath = path.join(folderPath, fileName);
            await fs.promises.rename(sourcePath, destPath);
        }
    }
};

const moveFilesToFolders = async() => {
    const folderNames = await getFolderNames(folderPath);
    await divideFilesByFolders(folderPath, folderNames);
};

//moveFilesToFolders();
module.exports = moveFilesToFolders;