const warCheckerData = require('./models/warcheckqueries')



// const duplicates = [];
// const duplicatesWithInconsistencies = [];
// const duplicateConfigNames = {};
warCheckerData.checkDataForcherere().then(
    async rows => {
        const duplicates = [];
        const duplicatesWithDates = {};
        for (const row of rows) {
            const key = `${row.appname}-${row.config_name}`;

            if (duplicates.includes(key)) {
                const existingDate = duplicatesWithDates[key].update_time;
                console.log(`Duplicate found - Name: ${row.id} ${row.appname}, Configuration: ${row.config_name},
                ne Date :${row.update_time}  Date: ${duplicatesWithDates[key].update_time}`);
                if (row.check_sum === null || duplicatesWithDates[key].check_sum === null) {
                    console.log(`Skipping - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(" check is null.");
                } else if (row.check_sum === duplicatesWithDates[key].check_sum) {
                    console.log(" all files are up to date");
                    warCheckerData.updateAppStatus(row.id, 'up to date')
                    warCheckerData.updateAppStatus(duplicatesWithDates[key].id, 'up to date')
                } else if (row.update_time === null || existingDate === null) {
                    console.log(`Skipping - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log("    Date is null.");
                    // continue; // Skip processing and move to the next row
                } else if (row.update_time === existingDate) {
                    console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(`    Newer Date: ${row.update_time}`);
                    console.log(`    Existing Date: ${existingDate}`);
                    console.log("    Dates are the same.");
                    warCheckerData.updateAppStatus(row.id, 'up to date')
                    warCheckerData.updateAppStatus(duplicatesWithDates[key].id, 'up to date')

                } else if (row.update_time > existingDate) {
                    console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(`    Newer Date: ${row.update_time}`);
                    console.log(`    Existing Date: ${existingDate}`);
                    console.log("    Newer Date is up to date.");
                    warCheckerData.updateAppStatus(row.id, 'up to date')
                    warCheckerData.updateAppStatus(duplicatesWithDates[key].id, 'out of date')

                    // duplicatesWithDates[key] = row;
                } else {
                    console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(`    Newer Date: ${row.update_time}`);
                    console.log(`    Existing Date: ${existingDate}`);
                    console.log("    Newer Date is out of date.");
                    warCheckerData.updateAppStatus(row.id, 'out to date')
                    warCheckerData.updateAppStatus(duplicatesWithDates[key].id, 'up to date')

                }


            } else {
                console.log(`Name: ${row.appname}, Configuration: ${row.config_name}, Date: ${row.update_time}`);
                duplicates.push(key);
                duplicatesWithDates[key] = row; // Assuming the date column is named 'date'
            }

        }



    }

).catch(error => {
    console.log(error)
})