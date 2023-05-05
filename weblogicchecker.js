const warCheckerData = require('./models/warcheckqueries')
const WebLogicAppInfo = require('./weblogic/weblogicchecker')


// let data = warCheckerData.checkData();

// console.log(data);

// for (const row of data) {
//     console.log(row.acdc_url);
// }

warCheckerData.checkData().then(rows => {
    for (const row of rows) {
        console.log(row.acdc_password)
        console.log(trimProtocol(row.acdc_url))
        console.log(row.acdc_username)
        console.log(row.cluster_name)
        console.log(row.teamid)
            // and so on...

        const acdc_username = row.acdc_username
        const acdc_url = trimProtocol(row.acdc_url)
        const acdc_password = row.acdc_password
        const cluster_name = row.cluster_name
        const teamid = row.teamid
        const location1 = 'primary';

        //secondary
        const ladc_username = row.ladc_username
        const ladc_url = trimProtocol(row.ladc_url)
        const ladc_password = row.ladc_password
        const location2 = 'Secondary';

        // const appInfo = new WebLogicAppInfo('t3://localhost:7001', 'weblogic', 'weblogic123', {
        //     host: 'localhost',
        //     user: 'dbuser',
        //     password: 'dbpassword',
        //     database: 'testdb',
        // });



    }
}).catch(error => {
    console.log(error)
})

function trimProtocol(url) {
    return url.replace(/^https?:\/\//i, "");
}