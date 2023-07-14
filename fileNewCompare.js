const fs = require('fs');
const { diff_match_patch } = require('diff-match-patch');

async function compareFiles(file1Path, file2Path) {
    try {
        // Read the contents of both files
        const file1Content = await fs.promises.readFile(file1Path, 'utf8');
        const file2Content = await fs.promises.readFile(file2Path, 'utf8');

        // Normalize line breaks in the contents
        const normalizedFile1Content = normalizeLineBreaks(file1Content);
        const normalizedFile2Content = normalizeLineBreaks(file2Content);

        // Compare the normalized contents using diff-match-patch library
        const dmp = new diff_match_patch();
        const diffs1 = dmp.diff_main(normalizedFile1Content, normalizedFile2Content);
        const diffs2 = dmp.diff_main(normalizedFile2Content, normalizedFile1Content);

        // Filter out the common lines
        const file1UniqueLines = [];
        const file2UniqueLines = [];

        let lineNumber1 = 1;
        let lineNumber2 = 1;

        for (const [operation, text] of diffs1) {
            const lines = text.split('\n');
            const lineCount = lines.length;

            if (operation === -1) {
                for (let i = 0; i < lineCount; i++) {
                    const lineNumber = lineNumber1 + i;
                    const lineText = lines[i] || ''; // Account for blank lines
                    const indicator = lineNumber <= lineNumber2 ? ' ' : '*';
                    file1UniqueLines.push({ lineNumber, lineText, indicator });
                }
            } else {
                lineNumber2 += lineCount;
            }
            lineNumber1 += lineCount;
        }

        lineNumber1 = 1; // Reset lineNumber1
        lineNumber2 = 1; // Reset lineNumber2

        for (const [operation, text] of diffs2) {
            const lines = text.split('\n');
            const lineCount = lines.length;

            if (operation === -1) {
                for (let i = 0; i < lineCount; i++) {
                    const lineNumber = lineNumber2 + i;
                    const lineText = lines[i] || ''; // Account for blank lines
                    const indicator = lineNumber <= lineNumber1 ? ' ' : '*';
                    file2UniqueLines.push({ lineNumber, lineText, indicator });
                }
            } else {
                lineNumber1 += lineCount;
            }
            lineNumber2 += lineCount;
        }

        // Return the differences for each file separately
        const file1ComparisonResults = {
            filePath: file1Path,
            filePath2: file2Path,
            lines: file1UniqueLines
        };

        const file2ComparisonResults = {
            filePath: file2Path,
            filePath1: file1Path,
            lines: file2UniqueLines
        };

        return { file1: file1ComparisonResults, file2: file2ComparisonResults };
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

function normalizeLineBreaks(content) {
    return content.replace(/\r\n|\r/g, '\n');
}
// Usage:
compareFiles('/Users/mac/Desktop/project/sadasd/sadasd_172.27.48.161_Primary_mobilemoneyservices.properties', '/Users/mac/Desktop/project/sadasd/sadasd_172.27.48.161_Primary_mobilemoneyservicesv2.properties')
    .then(result => {
        // console.log(result);
        console.log('Comparison Results for File 1:');
        console.log(result.file1);
        console.log('Comparison Results for File 2:');
        console.log(result.file2);
    })
    .catch(error => {
        console.error('An error occurred:', error.message);
    });