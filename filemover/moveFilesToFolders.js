const fs = require('fs');
const path = require('path');

const folderPath = '/Users/mac/Desktop/untitled folder 2/Output';

// Get all folder names from the given path
const getFolderNames = (dirPath) => {
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

function getTotalDirsInDir(dirPath) {
  // Get the list of files in the directory
  const files = fs.readdirSync(dirPath);
  
  // Filter out non-directories and return the count of directories
  return files.filter(file => {
    return fs.statSync(path.join(dirPath, file)).isDirectory();
  }).length;
}

// Divide files by the number of folders and move to each folder
const divideFilesByFolders = (filePath, folderNames) => {
  // Get all files from the given path
  const allFiles = fs.readdirSync(filePath);
  
  // Filter out directories from the files array
  const files = allFiles.filter(file => fs.lstatSync(path.join(filePath, file)).isFile());
  
  // Calculate the number of files per folder
  const filesPerFolder = Math.ceil(files.length / folderNames.length);
  
  // Loop through each folder and move the files to that folder
  let fileIndex = 0;
  for (let i = 0; i < folderNames.length; i++) {
    const folderName = folderNames[i];
    const folderPath = path.join(filePath, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    
    for (let j = 0; j < filesPerFolder && fileIndex < files.length; j++) {
      const fileName = files[fileIndex];
      const sourcePath = path.join(filePath, fileName);
      const destPath = path.join(folderPath, fileName);
      fs.renameSync(sourcePath, destPath);
      fileIndex++;
    }
  }
};

// Move files to folders
const moveFilesToFolders = () => {
  // Get all folder names from the given path
  const folderNames = getFolderNames(folderPath);

  // Divide files by the number of folders and move to each folder
  divideFilesByFolders(folderPath, folderNames);
};

module.exports = moveFilesToFolders;
