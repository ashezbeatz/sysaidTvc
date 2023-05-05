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
           from configs`;
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
}



module.exports = warCheckerData;