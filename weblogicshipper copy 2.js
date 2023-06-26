const warCheckerData = require('./models/warcheckqueries')



const duplicates = [];
const duplicatesWithInconsistencies = [];
warCheckerData.checkDataForcherere().then(
    async rows => {
        for (const row of rows) {

            //console.log(row)

            const existingDuplicate = duplicates.find((duplicate) => {
                return duplicate.appname === row.appname && duplicate.config_name === row.config_name;
            });

            if (existingDuplicate) {
                if (row.update_time > existingDuplicate.update_time) {
                    console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(`The existing duplicate is up to date - Date: ${row.date}`);
                    console.log(`The new duplicate is not up to date - Date: ${existingDuplicate.date}`);
                } else if (row.update_time < existingDuplicate.update_time) {
                    console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(`The existing duplicate is not up to date - Date: ${existingDuplicate.update_time}`);
                    console.log(`The new duplicate is up to date - Date: ${row.update_time}`);
                } else {
                    console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
                    console.log(`Both duplicates have the same date - Date: ${row.update_time}`);
                }
            } else {
                console.log(`Name: ${row.appname}, Configuration: ${row.config_name}`);
                duplicates.push({ appname: row.appname, config_name: row.config_name, date: row.update_time });
            }
        }



    }

).catch(error => {
    console.log(error)
})