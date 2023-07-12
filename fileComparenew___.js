const fs = require('fs').promises;
const { diff_match_patch: DiffMatchPatch } = require('diff-match-patch');

async function compareFiles(file1Path, file2Path) {
    try {
        // Read the contents of both files
        const file1Content = await fs.readFile(file1Path, 'utf8');
        const file2Content = await fs.readFile(file2Path, 'utf8');

        // Compare the contents using diff-match-patch library
        const dmp = new DiffMatchPatch();
        const diffs1 = dmp.diff_main(file1Content, file2Content);
        const diffs2 = dmp.diff_main(file2Content, file1Content);

        // Filter out the lines present in file1 but not in file2
        const file1NotInFile2 = [];
        let lineNumber = 1;

        for (const [operation, text] of diffs1) {
            if (operation === -1) {
                file1NotInFile2.push({ lineNumber, lineText: text });
            } else {
                lineNumber += text.split('\n').length - 1;
            }
        }

        // Filter out the lines present in file2 but not in file1
        const file2NotInFile1 = [];
        lineNumber = 1;

        for (const [operation, text] of diffs2) {
            if (operation === -1) {
                file2NotInFile1.push({ lineNumber, lineText: text });
            } else {
                lineNumber += text.split('\n').length - 1;
            }
        }

        // Return the lines present in file1 but not in file2, and vice versa
        return { file1NotInFile2, file2NotInFile1 };
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

// Usage example
compareFiles('/Users/mac/Desktop/script/mobilemoneyservices.properties', '/Users/mac/Desktop/script/mobilemoneyservicesv2.properties')
    .then((results) => {
        if (results) {
            console.log(`Lines present in 'file1' but not in 'file2':`);
            results.file1NotInFile2.forEach(({ lineNumber, lineText }) => {
                console.log(`Line ${lineNumber}: ${lineText}`);
            });

            console.log(`\nLines present in 'file2' but not in 'file1':`);
            results.file2NotInFile1.forEach(({ lineNumber, lineText }) => {
                console.log(`Line ${lineNumber}: ${lineText}`);
            });
            // Further processing with the comparison results
        }
    })
    .catch((error) => {
        console.error('An error occurred:', error.message);
    });