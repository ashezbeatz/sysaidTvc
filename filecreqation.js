const fs = require('fs');
const path = require('path');

function getFiles(directory) {
    let fileList = [];

    function traverseDirectory(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                traverseDirectory(filePath); // Recursively traverse subdirectories
            } else if (stats.isFile()) {
                fileList.push(filePath);
            }
        });
    }

    traverseDirectory(directory);

    return fileList;
}

function checkDuplicateFileNames(directory) {
    const files = getFiles(directory);
    const fileNames = files.map(filePath => path.basename(filePath));

    const duplicates = {};

    fileNames.forEach(fileName => {
        if (duplicates[fileName]) {
            duplicates[fileName].push(fileName);
        } else {
            duplicates[fileName] = [fileName];
        }
    });

    const duplicateFiles = Object.values(duplicates).filter(names => names.length > 1);

    return duplicateFiles;
}

// Usage example
const directoryPath = '/path/to/directory';
const duplicateFiles = checkDuplicateFileNames(directoryPath);

console.log('All files:');
getFiles(directoryPath).forEach(filePath => {
    console.log(filePath);
});

console.log('\nDuplicate file names:');
duplicateFiles.forEach(fileNames => {
    console.log(fileNames.join('\n'));
});