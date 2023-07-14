const fs = require('fs');

async function compareFiles(fileA, fileB) {
    const contentA = await fs.readFileSync(fileA, 'utf8');
    const contentB = await fs.readFileSync(fileB, 'utf8');

    const linesA = contentA.split('\n');
    const linesB = contentB.split('\n');

    const uniqueInA = linesA
        .map((line, index) => ({ line: index + 1, text: line.trim() }))
        .filter(({ text }) => text !== '' && !linesB.includes(text));

    const uniqueInB = linesB
        .map((line, index) => ({ line: index + 1, text: line.trim() }))
        .filter(({ text }) => text !== '' && !linesA.includes(text));

    const file1ComparisonResults = {
        filePath: fileA,
        filePath2: fileB,
        lines: uniqueInA
    };
    const file2ComparisonResults = {
        filePath: fileB,
        filePath1: fileA,
        lines: uniqueInB
    };
    // return {
    //     uniqueInA,
    //     uniqueInB
    // };
    return { uniqueInA: file1ComparisonResults, uniqueInB: file2ComparisonResults };

}


compareFiles('/Users/mac/Desktop/project/sadasd/sadasd_172.27.48.161_Primary_mobilemoneyservices.properties', '/Users/mac/Desktop/project/sadasd/sadasd_172.27.48.161_Primary_mobilemoneyservicesv2.properties');

////console.log('Lines in file A but not in file B:');
//const dataA = JSON.stringify(comparisonResult.file1, null, 2);
//console.log(comparisonResult.uniqueInB);
// const dataA = JSON.stringify(comparisonResult.uniqueInA, null, 2);
// //comparisonResult.uniqueInA.forEach(line => console.log(`Line ${line.line}: ${line.text}`));
// //console.log(dataA)
// console.log('-----------------------------');
// console.log('Lines in file B but not in file A:');
// //comparisonResult.uniqueInB.forEach(line => console.log(`Line ${line.line}: ${line.text}`));
// const dataB = JSON.stringify(comparisonResult.uniqueInB, null, 2);
// console.log(comparisonResult.uniqueInB)