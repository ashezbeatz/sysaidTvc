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

        for (const [operation, text] of diffs1) {
            if (operation === -1) {
                file1UniqueLines.push(text);
            }
        }

        for (const [operation, text] of diffs2) {
            if (operation === -1) {
                file2UniqueLines.push(text);
            }
        }

        // Print the differences
        if (file1UniqueLines.length === 0 && file2UniqueLines.length === 0) {
            console.log(`The files '${file1Path}' and '${file2Path}' have the same content.`);
        } else {
            if (file1UniqueLines.length > 0) {
                console.log(`Lines present in '${file1Path}' but not in '${file2Path}':`);
                console.log(file1UniqueLines.join('\n'));
            }
            if (file2UniqueLines.length > 0) {
                console.log(`Lines present in '${file2Path}' but not in '${file1Path}':`);
                console.log(file2UniqueLines.join('\n'));
            }
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

compareFiles('/Users/mac/Desktop/project/sdffdsfs/sdffdsfs_192.168.200.235_Primary_Rafiki-Orchestrator.properties', '/Users/mac/Desktop/script/Rafiki-Orchestrator.properties');