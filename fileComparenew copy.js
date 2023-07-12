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

        // Filter out the common lines
        const file1UniqueLines = [];
        const file2UniqueLines = [];

        let lineNumber1 = 1;
        let lineNumber2 = 1;

        for (const [operation, text] of diffs1) {
            if (operation === -1) {
                file1UniqueLines.push({ lineNumber: lineNumber1, lineText: text });
            } else {
                lineNumber2 += text.split('\n').length - 1;
            }
            lineNumber1 += text.split('\n').length - 1;
        }

        for (const [operation, text] of diffs2) {
            if (operation === -1) {
                file2UniqueLines.push({ lineNumber: lineNumber2, lineText: text });
            } else {
                lineNumber1 += text.split('\n').length - 1;
            }
            lineNumber2 += text.split('\n').length - 1;
        }

        // Return the differences for each file separately
        const file1ComparisonResults = {
            filePath: file1Path,
            filePath2: file2Path,
            uniqueLines: file1UniqueLines
        };

        const file2ComparisonResults = {
            filePath: file2Path,
            filePath1: file1Path,
            uniqueLines: file2UniqueLines
        };

        return { file1: file1ComparisonResults, file2: file2ComparisonResults };
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

// Usage example
compareFiles('/Users/mac/Desktop/script/mobilemoneyservices.properties', '/Users/mac/Desktop/script/mobilemoneyservicesv2.properties')
    .then((results) => {
        if (results) {
            console.log('Comparison Results for File 1:');
            console.log(results.file1);
            console.log('Comparison Results for File 2:');
            console.log(results.file2);

            let response = `${results.file2.filePath}\n`;
            console.log("resp : " + response);
            // Further processing with the comparison results
            for (const line of results.file2.uniqueLines) {
                response += `${line.lineNumber}: ${line.lineText}\n`;
            }

            console.log("res :" + response);
        }
    })
    .catch((error) => {
        console.error('An error occurred:', error.message);
    });