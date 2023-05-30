const db = require('../configuration/WarDatabase');
//constwb
const moment = require('moment');
const uuid = require('uuid');



class warCheckerData {
    constructor() {


    }

    static async checkData() {
        let connection;

        try {
            connection = await db.pool.getConnection();
            const query = `SELECT
           acdc_password,acdc_url,acdc_username,ladc_password,ladc_url,ladc_username,category,
           cluster_name,teamid
           from configs where status='Active'`;
            const [rows, fields] = await connection.query(query);
            connection.release();
            console.log(rows);
            return rows;

        } catch (error) {
            connection.release();
            console.log(error);
            return [];
        }
    }

    static async insertAppInfo(info, teamid, catergory, location) {
        let connection;
        try {
            connection = await db.pool.getConnection();
            const query = `INSERT INTO application_info(appname,
                config_name,create_date,created_by,
                partition_location,teamid,size,deployment_time,update_time)
                VALUES(?,?,NOW(),?,?,?,?,?,?)
                
            `;
            const values2 = [info.name, catergory, 'jobs',
                location, teamid, info.size, info.deploymentTime,
                info.updateTime,
            ];
            const [rows, fields] = await connection.query(query, values2);

            connection.release();
            return rows.insertId;

        } catch (error) {


        }

    }

    static async insertAppsInfonew(name, teamid, catergory, location) {

        let connection;
        try {
            connection = await db.pool.getConnection();
            const query = `INSERT INTO application_info(appname,
                config_name,create_date,created_by,
                partition_location,teamid)
                VALUES(?,?,NOW(),?,?,?)
                
            `;
            const values2 = [name, catergory, 'jobs',
                location, teamid
            ];
            const querySelect = `
              SELECT  id,appname FROM  application_info WHERE 
              appname= ? AND teamid= ?  AND partition_location= ?`;
            const values = [name, teamid, location];
            const [rowsd, fieldsd] = await connection.query(querySelect, values);
            if (rowsd.length > 0) {
                console.log('Data already exists');
                connection.release();
            } else {
                const [rows, fields] = await connection.query(query, values2);
                console.log('Data saved');
                connection.release();
                return rows.insertId;

            }

        } catch (error) {
            connection.release();
            console.log(error)
        }
    }
    static async insertAppsInfo(name, size, deploymentTime, updateTime, teamid, catergory, location) {
        let connection;
        try {
            connection = await db.pool.getConnection();

            const query = `INSERT INTO application_info(appname,
                config_name,create_date,created_by,
                partition_location,teamid,size,deployment_time,update_time)
                VALUES(?,?,NOW(),?,?,?,?,?,?)
                
            `;
            const values2 = [name, catergory, 'jobs',
                location, teamid, size, deploymentTime,
                updateTime
            ];
            const querySelect = `
              SELECT  id,appname FROM  application_info WHERE 
              appname= ? AND teamid= ?  AND config_name= ?`;
            const values = [name, teamid, catergory];
            const [rowsd, fieldsd] = await connection.query(querySelect, values);
            if (rowsd.length > 0) {
                const qud = `
                UPDATE application_info set size = ?, deployment_time=?
                  where id= ?      `;
                const vals = [size, deploymentTime, rowsd[0].id];

                console.log('Data already exists');
                const [rowsd, fieldsd] = await connection.query(qud, vals);
                connection.release();

            } else {
                const [rows, fields] = await connection.query(query, values2);

                connection.release();
                return rows.insertId;
            }



        } catch (error) {


        }

    }
}



module.exports = warCheckerData;