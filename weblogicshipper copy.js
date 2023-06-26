const warCheckerData = require('./models/warcheckqueries')



const duplicates = [];
warCheckerData.checkDataForcherere().then(
    async rows => {
        for (const row of rows) {

            //console.log(row)


            if (duplicates.includes(row.appname) && duplicates.includes(row.config_name)) {
                console.log(`Duplicate found - Name: ${row.appname}, Configuration: ${row.config_name}`);
            } else {
                console.log(`Name: ${row.appname}, Configuration: ${row.config_name}`);
                duplicates.push(row.appname, row.config_name);
            }
        }

    }

).catch(error => {
    console.log(error)
})