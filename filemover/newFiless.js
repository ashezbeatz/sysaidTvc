const fs = require('fs');
const path = require('path');

class FileMover {
  constructor(folderPath) {
    this.folderPath = folderPath;
    this.folderNames = this.getFolderNames(this.folderPath);
    this.totalFolders = this.folderNames.length;
  }

  // Get all folder names from the given path
  getFolderNames(dirPath) {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  // Get the total number of files in the given path
  getTotalFilesInDir(dirPath) {
    return fs.readdirSync(dirPath)
      .filter(file => fs.lstatSync(path.join(dirPath, file)).isFile())
      .length;
  }

  // Divide files by the number of folders and move to each folder
  divideFilesByFolders() {
    const totalFiles = this.getTotalFilesInDir(this.folderPath);
    const filesPerFolder = Math.ceil(totalFiles / this.totalFolders);
    let fileIndex = 0;

    for (let i = 0; i < this.totalFolders; i++) {
      const folderName = this.folderNames[i];
      const folderPath = path.join(this.folderPath, folderName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      for (let j = 0; j < filesPerFolder && fileIndex < totalFiles; j++) {
        const allFiles = fs.readdirSync(this.folderPath);
        const files = allFiles.filter(file => fs.lstatSync(path.join(this.folderPath, file)).isFile());
        const fileName = files[fileIndex];
        const sourcePath = path.join(this.folderPath, fileName);
        const destPath = path.join(folderPath, fileName);
        fs.renameSync(sourcePath, destPath);
        fileIndex++;
      }
    }
  }
}



module.exports = FileMover;