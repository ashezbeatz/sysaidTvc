const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, transports } = require('winston');
const fs = require('fs').promises;
const path = require('path');
const fsd = require('fs');
const warCheckerData = require('./models/warcheckqueries')


require("dotenv").config();
const folderName = 'logs';
const folderPath = path.join(process.cwd(), folderName);
if (!fsd.existsSync(folderPath)) {
    fsd.mkdirSync(folderPath);
    console.log('Folder created successfully.');
} else {
    console.log('Folder already exists.');
}
// Define the log file name
const logFileName = 'propscomp-%DATE%.log';
const logFilePath = path.join(folderPath, logFileName);

// Configure the logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winstonDailyRotateFile({
            filename: logFilePath,
            datePattern: 'YYYY-MM-DD',
            maxSize: '500m',
            maxFiles: '14d',
        })
    ]
});


////////////////////////////////////////////////////// 
// 
async function compareFiles(fileA, fileB) {
    const fileNameA = path.basename(fileA);
    const fileNameB = path.basename(fileB);

    try {
        const contentA = await fs.readFile(fileA, 'utf8');
        const contentB = await fs.readFile(fileB, 'utf8');

        const identical = contentA === contentB;

        let uniqueInA = [];
        let uniqueInB = [];

        if (!identical) {
            const linesA = contentA.split('\n');
            const linesB = contentB.split('\n');

            uniqueInA = linesA
                .map((line, index) => ({
                    line: index + 1,
                    text: line.trim(),
                }))
                .filter(({ text }) => text !== '' && !linesB.includes(text));

            uniqueInB = linesB
                .map((line, index) => ({
                    line: index + 1,
                    text: line.trim(),
                }))
                .filter(({ text }) => text !== '' && !linesA.includes(text));
        }

        return {
            identical,
            fileA: {
                fileName: fileNameA,
                filePath: fileA,
                data: uniqueInA,
            },
            fileB: {
                fileName: fileNameB,
                filePath: fileB,
                data: uniqueInB,
            },
        };
    } catch (error) {
        throw new Error('Error occurred during file comparison: ' + error.message);
    }
}
///////////////////////////////////////////////////



// Usage example
async function runComparison() {
    // const fileA = 'path/to/fileA.txt';
    //const fileB = 'path/to/fileB.txt';

    warCheckerData.checkPropertyData().then(
        async rows => {
            const duplicates = [];
            const duplicatesWithDates = {};
            for (const row of rows) {
                const key = `${row.appname}-${row.config_name}`;
                if (duplicates.includes(key)) {
                    const existingDate = duplicatesWithDates[key].appname;
                    console.log(`Duplicate found - Name: ${row.id} ${row.appname}, Configuration: ${row.config_name},
                        new path :${row.path}  old path: ${duplicatesWithDates[key].path} ${duplicatesWithDates[key].id} `);
                    logger.info(`Duplicate found - Name: ${row.id} ${row.appname}, Configuration: ${row.config_name},
                        new path :${row.path}  old path: ${duplicatesWithDates[key].path} ${duplicatesWithDates[key].id} `);

                    try {
                        const comparisonResult = await compareFiles(duplicatesWithDates[key].path, row.path);

                        // const [dataA, dataB] = comparisonResult;

                        // console.log('File A:', dataA);
                        // console.log('File B:', dataB);
                        const { identical, fileA, fileB } = comparisonResult;

                        // console.log('Identical Contents:', identical);
                        // console.log('File A:', fileA);
                        // console.log('File B:', fileB);
                        if (identical) {
                            console.log('The file contents are identical.');
                            warCheckerData.updatePropsFileStatus(duplicatesWithDates[key].id, "{}", "have the same content")
                            warCheckerData.updatePropsFileStatus(row.id, "{}", "have the same content")
                            logger.info(`The file contents are identical. ${duplicatesWithDates[key].path}  and ${row.path}`)
                        } else {
                            console.log('Lines in file A but not in file B:');
                            //fileA.data.forEach(({ line, text }) => console.log(`Line ${line}: ${text}`));
                            console.log('File A:', fileA);
                            logger.info(`Lines in file A but not in file B: ${JSON.stringify(fileA, null, 2)}`);
                            warCheckerData.updatePropsFileStatus(duplicatesWithDates[key].id, fileA, "do not have the same content")

                            console.log('\nLines in file B but not in file A:');
                            //fileB.data.forEach(({ line, text }) => console.log(`Line ${line}: ${text}`));
                            console.log('File B:', fileB);
                            logger.info(`\nLines in file B but not in file A: ${JSON.stringify(fileB, null, 2)}`);
                            warCheckerData.updatePropsFileStatus(row.id, fileB, "do not have the same content")

                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                    }
                } else {
                    //  console.log(`Name: ${row.appname}, Configuration: ${row.config_name}, Date: ${row.path}`);
                    duplicates.push(key);
                    duplicatesWithDates[key] = row; // Assuming the date column is named 'date'
                }

            }

        }
    ).catch((error) => {
        console.error('An error occurred:', error.message);
        logger.error('An error occurred:', error.message);
    });


    /* try {
         const comparisonResult = await compareFiles('/Users/mac/Desktop/project/sadasd/sadasd_172.27.48.161_Primary_mobilemoneyservices.properties', '/Users/mac/Desktop/project/sadasd/sadasd_172.27.48.161_Primary_mobilemoneyservicesv2.properties');

         // const [dataA, dataB] = comparisonResult;

         // console.log('File A:', dataA);
         // console.log('File B:', dataB);
         const { identical, fileA, fileB } = comparisonResult;

         // console.log('Identical Contents:', identical);
         // console.log('File A:', fileA);
         // console.log('File B:', fileB);
         if (identical) {
             console.log('The file contents are identical.');
         } else {
             console.log('Lines in file A but not in file B:');
             //fileA.data.forEach(({ line, text }) => console.log(`Line ${line}: ${text}`));
             console.log('File A:', fileA);
             console.log('\nLines in file B but not in file A:');
             //fileB.data.forEach(({ line, text }) => console.log(`Line ${line}: ${text}`));
             console.log('File B:', fileB);
         }
     } catch (error) {
         console.error('Error:', error.message);
     }*/
}

runComparison();