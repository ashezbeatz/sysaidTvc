const fs = require('fs').promises;
const { diff_match_patch: DiffMatchPatch } = require('diff-match-patch');
const warCheckerData = require('./models/warcheckqueries')

async function compareFiles(file1Path, file2Path) {
    try {
        // Read the contents of both files
        const file1Content = await fs.readFile(file1Path, 'utf8');
        const file2Content = await fs.readFile(file2Path, 'utf8');

        // Normalize line breaks in the contents
        const normalizedFile1Content = normalizeLineBreaks(file1Content);
        const normalizedFile2Content = normalizeLineBreaks(file2Content);

        // Compare the normalized contents using diff-match-patch library
        const dmp = new DiffMatchPatch();
        const diffs1 = dmp.diff_main(normalizedFile1Content, normalizedFile2Content);
        const diffs2 = dmp.diff_main(normalizedFile2Content, normalizedFile1Content);

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

// Helper function to normalize line breaks to '\n'
function normalizeLineBreaks(text) {
    return text.replace(/\r\n|\r/g, '\n');
}

// Usage example
//compareFiles('/Users/mac/Desktop/script/Rafiki-Orchestrator.properties', '/Users/mac/Desktop/script/Rafiki-Orchestrator.properties')
/*compareFiles('/Users/mac/Desktop/script/mobilemoneyservices.properties', '/Users/mac/Desktop/script/mobilemoneyservicesv2.properties')
    .then((results) => {
        if (results) {

            if (results.file1.uniqueLines.length === 0 && results.file2.uniqueLines.length === 0) {
                console.log(`The files '${results.file1.filePath}' and '${results.file2.filePath}' have the same content.`);

            } else {
                console.log('Comparison Results for File 1:');
                console.log(results.file1);
                console.log('Comparison Results for File 2:');
                console.log(results.file2);

                let response = `Lines present in '${results.file2.filePath}' but not in '${results.file2.filePath1}':\n`;
                console.log("Response: " + response);
                // Further processing with the comparison results
                for (const line of results.file2.uniqueLines) {
                    response += `${line.lineNumber}: ${line.lineText}\n`;
                }

                console.log("Response: " + response);
            }
        }
    })
    .catch((error) => {
        console.error('An error occurred:', error.message);
    });*/

warCheckerData.checkPropertyData().then(
    async rows => {
        const duplicates = [];
        const duplicatesWithDates = {};
        for (const row of rows) {
            const key = `${row.appname}-${row.config_name}`;

            if (duplicates.includes(key)) {
                const existingDate = duplicatesWithDates[key].appname;
                console.log(`Duplicate found - Name: ${row.id} ${row.appname}, Configuration: ${row.config_name},
                    new path :${row.path}  old path: ${duplicatesWithDates[key].path}`);



            } else {
                console.log(`Name: ${row.appname}, Configuration: ${row.config_name}, Date: ${row.path}`);
                duplicates.push(key);
                duplicatesWithDates[key] = row; // Assuming the date column is named 'date'
            }

        }



    }

).catch(error => {
    console.log(error)
})