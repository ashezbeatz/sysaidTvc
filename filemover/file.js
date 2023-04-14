const fs = require('fs');
const path = require('path');

function getTotalDirsInDir(dirPath) {
  // Get the list of files in the directory
  const files = fs.readdirSync(dirPath);

  // Filter out non-directories and return the count of directories
  return files.filter(file => {
    return fs.statSync(path.join(dirPath, file)).isDirectory();
  }).length;
}

function divideFilesByFolders2(dirPath, numFolders) {
    // Get the list of existing subdirectories
    const subdirs = fs.readdirSync(dirPath).filter(item => {
      return fs.statSync(path.join(dirPath, item)).isDirectory();
    });
  
    // Use existing subdirectories if possible, otherwise create new ones
    for (let i = 1; i <= numFolders; i++) {
      if (i > subdirs.length) {
        fs.mkdirSync(path.join(dirPath, `folder${i}`));
      }
    }
  
    // Get the list of files in the directory
    const files = fs.readdirSync(dirPath);
  
    // Calculate the number of files per folder
    const numFilesPerFolder = Math.floor(files.length / numFolders);
    const numFilesLeftover = files.length % numFolders;
  
    // Distribute the files among the folders
    let filesPerFolder = 0;
    let currentFolder = 1;
  
    files.forEach(file => {
      const sourcePath = path.join(dirPath, file);
      const destPath = path.join(dirPath, `folder${currentFolder}`, file);
      fs.renameSync(sourcePath, destPath);
  
      filesPerFolder++;
  
      // Switch to the next folder if the limit is reached
      if (filesPerFolder >= numFilesPerFolder) {
        currentFolder++;
        filesPerFolder = 0;
  
        // Handle leftover files by adding them to the last folder
        if (currentFolder > numFolders - numFilesLeftover) {
          currentFolder = numFolders - numFilesLeftover + 1;
        }
      }
    });
  
    // Return the number of files moved
    return files.length;
  }
  
  function getTotalFilesInDir(dirPath) {
    // Get the list of files in the directory
    const files = fs.readdirSync(dirPath);
  
    // Filter out directories and return the count of files
    return files.filter(file => {
      return fs.statSync(path.join(dirPath, file)).isFile();
    }).length;
  }


  function divideFilesByFolders(srcDir, destDir, numFolders) {
    const files = fs.readdirSync(srcDir);
    const filesPerFolder = Math.ceil(files.length / numFolders);
  
    let folderNum = 1;
    let fileNum = 0;
  
    const folders = [];
    for (let i = 1; i <= numFolders; i++) {
      const folderName = `folder${i}`;
      const folderPath = path.join(destDir, folderName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      folders.push(folderPath);
    }
  
    files.forEach(file => {
      const srcPath = path.join(srcDir, file);
      if (fs.statSync(srcPath).isFile()) {
        if (fileNum >= filesPerFolder) {
          fileNum = 0;
          folderNum++;
        }
        const destPath = path.join(folders[folderNum - 1], file);
        if (fs.existsSync(srcPath)) {
          fs.renameSync(srcPath, destPath);
          fileNum++;
        } else {
          console.error(`File '${srcPath}' does not exist.`);
        }
      }
    });
  }

// Example usage
const dirPath = '/Users/mac/Desktop/untitled folder 2/Output';
const totalDirs = getTotalDirsInDir(dirPath);
console.log(`Total number of directories in directory '${dirPath}': ${totalDirs}`);
const totalFiles = getTotalFilesInDir(dirPath);
console.log(`Total number of files in directory '${dirPath}': ${totalFiles}`);

const filesMoved = divideFilesByFolders(dirPath, totalDirs);
console.log(`Moved ${filesMoved} files into ${totalDirs} folders.`);