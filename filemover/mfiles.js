const fs = require('fs');
const path = require('path');

function getTotalFilesInDir(dirPath) {
  let files = [];

  if (typeof dirPath === 'string') {
    // Get the list of files in the directory
    files = fs.readdirSync(dirPath);
  } else {
    console.error(`Invalid directory path: ${dirPath}`);
  }

  return files.length;
}

function getNumFilesPerFolder(totalFiles, numFolders) {
  return Math.floor(totalFiles / numFolders);
}

function divideFilesByFolders2(dirPath, numFilesPerFolder, numFolders) {
  // Create folder paths
  const folderPaths = [];
  for (let i = 1; i <= numFolders; i++) {
    const folderPath = path.join(dirPath, `folder${i}`);
    folderPaths.push(folderPath);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  // Get the list of files in the directory
  const files = fs.readdirSync(dirPath);

  // Move the files to the folders
  let folderIndex = 0;
  files.forEach((file) => {
    if (!fs.lstatSync(path.join(dirPath, file)).isDirectory()) {
      const filePath = path.join(dirPath, file);
      const destFolder = folderPaths[folderIndex];
      const destPath = path.join(destFolder, file);

      fs.renameSync(filePath, destPath);

      folderIndex++;
      if (folderIndex === numFolders) {
        folderIndex = 0;
      }
    }
  });
}

function checkFilesInDir(dirPath) {
  let files = [];

  if (typeof dirPath === 'string') {
    // Get the list of files in the directory
    files = fs.readdirSync(dirPath);
  } else {
    console.error(`Invalid directory path: ${dirPath}`);
  }

  return files;
}

function getTotalDirsInDir(dirPath) {
  // Get the list of files in the directory
  const files = fs.readdirSync(dirPath);

  // Filter out non-directories and return the count of directories
  return files.filter(file => {
    return fs.statSync(path.join(dirPath, file)).isDirectory();
  }).length;
}

function divideFilesByFolders(dirPath, numFilesPerFolder, numFolders) {
    // Get the list of folders in the directory
    const folderList = fs
      .readdirSync(dirPath)
      .filter((file) => fs.lstatSync(path.join(dirPath, file)).isDirectory());
  
    // Move the files to the folders
    let folderIndex = 0;
    for (let i = 0; i < folderList.length; i++) {
      const folderPath = path.join(dirPath, folderList[i]);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => !fs.lstatSync(path.join(folderPath, file)).isDirectory());
      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        const filePath = path.join(folderPath, file);
        const destFolder = folderList[folderIndex];
        const destPath = path.join(dirPath, destFolder, file);
        fs.renameSync(filePath, destPath);
        folderIndex++;
        if (folderIndex === numFolders) {
          folderIndex = 0;
        }
      }
    }
  }
// Example usage
const dirPath = '/Users/mac/Desktop/untitled folder 2/Output';
const numFolders = getTotalDirsInDir(dirPath);

const totalFiles = getTotalFilesInDir(dirPath);
console.log(`Total number of directories in directory '${totalFiles}'`);

const numFilesPerFolder = getNumFilesPerFolder(totalFiles, numFolders);

divideFilesByFolders(dirPath, numFilesPerFolder, numFolders);

// Check if the files have been moved successfully
// for (let i = 1; i <= numFolders; i++) {
//   const folderPath = path.join(dirPath, `folder${i}`);
//   const filesInFolder = checkFilesInDir(folderPath);
  
//   console.log(`Number of files in folder${i}: ${filesInFolder.length}`);
// }





const folderNames = fs.readdirSync(dirPath).filter(item => {
    const itemPath = path.join(dirPath, item);
    const folderPath = itemPath
    const filesInFolder = checkFilesInDir(folderPath);
    console.log(`Number of files in ${folderPath}: ${filesInFolder.length}`);
    return fs.lstatSync(itemPath).isDirectory();
   // const filesInFolder = checkFilesInDir(folderPath);
  });
  
  console.log(folderNames); 