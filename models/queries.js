const db = require('../configuration/Database');
const moment = require('moment');
const uuid = require('uuid');

class PostData {
    constructor(sr_id, thirdLevelCategory, update_time, responsibility, request_user, assigned_group_code,
        assigned_group, insert_time, company, close_time, sr_type, sr_weight, status,
        status_code) {

        this.sr_id = sr_id,
            this.thirdLevelCategory = thirdLevelCategory,
            this.update_time = update_time,
            this.responsibility = responsibility,
            this.request_user = request_user,
            this.assigned_group_code = assigned_group_code,
            this.assigned_group = assigned_group,
            this.insert_time = insert_time,
            this.company = company,
            this.close_time = close_time,
            this.sr_type = sr_type,
            this.sr_weight = sr_weight,
            this.status = status,
            this.status_code = status_code
    }


    async saveData() {
        let connection;
        try {

            connection = await db.pool.getConnection();

            const query = 'SELECT sr_id,status FROM tvc WHERE sr_id = ?';
            const values2 = [this.sr_id];
            const sql = `
                INSERT INTO tvc(sr_id,
                    thirdLevelCategory,
                    update_time,responsibility,request_user,assigned_group_code,
                    assigned_group,insert_time,company,close_time,sr_type,sr_weight,
                    status,status_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `;

            const values = [
                this.sr_id,
                this.thirdLevelCategory,
                // this.update_time ? moment(this.update_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') :'',
                PostData.formatDatetime(this.update_time),
                this.responsibility,
                this.request_user,
                this.assigned_group_code,
                this.assigned_group,
                // this.insert_time? moment(this.insert_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '',
                PostData.formatDatetime(this.insert_time),
                this.company,
                //this.close_time ? moment(this.close_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '',
                PostData.formatDatetime(this.close_time),
                this.sr_type,
                this.sr_weight,
                this.status,
                this.status_code
            ];
            const [rows, fields] = await connection.query(query, values2);
            let result;
            if (rows.length > 0) {
                console.log('Data already exists');
                //result='Data already exists';
                const newqus = `update  tvc set old_status= ? ,status = ?, update_time= ?,close_time= ?, thirdLevelCategory =?,
                    sr_type = ?,responsibility =?
                    where sr_id=? `;
                const vals = [rows[0].status,
                    this.status,
                    moment(this.update_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                    PostData.formatDatetime(this.close_time),
                    this.thirdLevelCategory,
                    this.sr_type,
                    this.responsibility,
                    this.sr_id
                ]
                result = await connection.query(newqus, vals)
                if (rows[0].status === this.status) {
                    console.log('status not changed ' + rows[0].status + " === " + this.status);
                } else {

                    console.log("update data : " + result + " : status :" + JSON.stringify(rows))

                }
                console.log("update data : " + result + " : status :" + JSON.stringify(rows))

                connection.release();
                return result;
            } else {

                result = await connection.query(sql, values);
                console.log('Data inserted successfully');
                connection.release();
                return result;
            }
        } catch (error) {
            console.log(error);
        }

    }
    static async saveDetails(tiketid, sr_title, third_category, requestor, responsibility, assign_group, company, status, sr_type, ticket_date, input_type, service_name, approved_test_cases, test_case_approver, cleared, request_clearance_cab, cab_cleared_by, test_type, performance_received, performance, results, breach, test_lead, timeline, comments) {
        let connection;
        try {
            connection = await db.pool.getConnection();
            const query = 'SELECT tvcd_srid FROM tvc_details WHERE tvcd_srid = ?';
            const values2 = [tiketid];
            const sql = `
                  INSERT INTO tvc_details(tvcd_code,tvcd_srid,tvcd_description,tvcd_thirdLevelCategory,tvcd_requestor,
                    tvcd_responsibility,tvcd_assigngroup,tvcd_company,tvcd_status,tvcd_srtype,
                    tvcd_date,tvcd_inputtype,tvcd_service_name,tvcd_approve_testcases,tvcd_test_case_approver,
                    tvcd_cleared,tvcd_request_clearance_cab,tvcd_cba_clearance_by,tvcd_test_type,tvcd_performance_received,
                    tvcd_performance,tvcd_result,tvcd_breach,tvcd_test_lead,tvcd_timeline,tvcd_comments) 
                    VALUES(
                      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
                    )
            `;
            const values = [
                this.generateUniqueNumber(),
                tiketid,
                sr_title,
                third_category,
                requestor,
                responsibility,
                assign_group,
                company,
                status,
                sr_type,
                ticket_date,
                input_type,
                service_name,
                approved_test_cases,
                test_case_approver,
                cleared,
                request_clearance_cab,
                cab_cleared_by,
                test_type,
                performance_received,
                performance,
                results,
                breach,
                test_lead,
                timeline,
                comments
            ]
            const [rows, fields] = await connection.query(query, values2);
            let result;
            if (rows.length > 0) {
                console.log('Data already exists');
                result = ['Data already exists'];
                connection.release();
                return result;
            } else {
                result = await connection.query(sql, values);
                console.log('Data inserted successfully');
                connection.release();
                return result;
            }

        } catch (error) {
            console.log(error);
        }
    }
    static async updateSrsData(sr_title, sr_id) {
        let connection;
        try {

            connection = await db.pool.getConnection();



            let result;
            //result='Data already exists';
            const newqus = `
                update tvc set sr_title = ?
                    where sr_id = ? `;
            const vals = [sr_title,
                sr_id
            ]
            result = await connection.query(newqus, vals)

            console.log("update data : " + result + " : status :" + JSON.stringify(result))

            connection.release();
            return result;

        } catch (error) {
            console.log(error);
        }

    }
    static formatDatetime(datetime) {
        if (!datetime) {
            return null;
        } else {
            const formattedDatetime = moment(datetime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            return formattedDatetime;
        }
    }

    static async getData() {

        let connection;

        try {
            connection = await db.pool.getConnection();
            const query = `
                select count(1) as tots, sum(
                        case when status = 'Declined - Incomplete Request'
                        then 1
                        else 0 end) as Declined,
                    sum(
                        case when status = 'Approved for UAT'
                        then 1
                        else 0 end) as UAT,
                    sum(
                        case when status = 'Validated for CAB'
                        then 1
                        else 0 end) as CAB,
                    sum(
                        case when status = 'Resolved - Pending customer confirmation'
                        then 1
                        else 0 end) as Resolved,
                    sum(
                        case when status = 'Request for authorization'
                        then 1
                        else 0 end) as RequestA,
                    sum(
                        case when status = 'Scheduled for Review'
                        then 1
                        else 0 end) as Scheduled

                from tvc where date(close_time) = CURDATE() and sr_type != 'Change'
                `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }

    static async getSRS() {

        let connection;

        try {
            connection = await db.pool.getConnection();
            const query = `
                select sr_id from tvc where sr_title is null `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? rows : []


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }

    static async getDataNew(start, end, type) {

        let connection;
        let dates;
        if (type == 'Yesterday') {
            dates = ` = CURDATE() - 1 `
        } else if (type == 'Today') {
            dates = ` = CURDATE()
                `
        } else {
            dates = `
                between '${start}'
                and '${end}'
                `
        }
        console.log(dates);
        try {
            connection = await db.pool.getConnection();
            const query = `
                SELECT COUNT(1) AS tots,
                    COALESCE(SUM(CASE WHEN status = 'Declined - Incomplete Request'
                        THEN 1 ELSE 0 END), 0) AS Declined,
                    COALESCE(SUM(CASE WHEN status = 'Approved for UAT'
                        THEN 1 ELSE 0 END), 0) AS UAT,
                    COALESCE(SUM(CASE WHEN status = 'Validated for CAB'
                        THEN 1 ELSE 0 END), 0) AS CAB,
                    COALESCE(SUM(CASE WHEN status = 'Resolved - Pending customer confirmation'
                        THEN 1 ELSE 0 END), 0) AS Resolved,
                    COALESCE(SUM(CASE WHEN status = 'Request for authorization'
                        THEN 1 ELSE 0 END), 0) AS RequestA,
                    COALESCE(SUM(CASE WHEN status = 'Scheduled for Review'
                        THEN 1 ELSE 0 END), 0) AS Scheduled

                from tvc where date(close_time) ${ dates }
                and sr_type != 'Change'
                `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }
    static async getDataNew2(start, end, type) {

        let connection;
        let dates;
        if (type == 'Yesterday') {
            dates = ` = CURDATE() - 1 `
        } else if (type == 'Today') {
            dates = ` = CURDATE()
                `
        } else {
            dates = `
                between '${start}'
                and '${end}'
                `
        }
        console.log(dates);
        try {
            connection = await db.pool.getConnection();
            const query = `
                select count(1) as tots, sum(
                        case when status = 'Declined - Incomplete Request'
                        then 1
                        else 0 end) as Declined,
                    sum(
                        case when status = 'Approved for UAT'
                        then 1
                        else 0 end) as UAT,
                    sum(
                        case when status = 'Validated for CAB'
                        then 1
                        else 0 end) as CAB,
                    sum(
                        case when status = 'Resolved - Pending customer confirmation'
                        then 1
                        else 0 end) as Resolved,
                    sum(
                        case when status = 'Request for authorization'
                        then 1
                        else 0 end) as RequestA,
                    sum(
                        case when status = 'Scheduled for Review'
                        then 1
                        else 0 end) as Scheduled

                from tvc where date(close_time) ${ dates }
                and sr_type != 'Change'
                `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }


    static async getDataNewStatus(start, end, type) {

        let connection;
        let dates;
        if (type == 'Declined') {
            dates = `
                status = 'Declined - Incomplete Request'
                and date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        } else if (type == 'UAT') {
            dates = `
                status = 'Approved for UAT'
                and date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        } else if (type == 'CAB') {
            dates = `
                status = 'Validated for CAB'
                and date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        } else if (type == 'New') {
            dates = `
                status = 'New'
                and sr_type != 'Change'
                `
        } else if (type == 'Pending') {
            dates = `
                status = 'Pending'
                and sr_type != 'Change'
                `
        } else if (type == 'InProgress') {
            dates = `
                status in ('In Progress', 'Review In Progress') and sr_type != 'Change'
                `
        } else if (type == 'Resolved') {
            dates = `
                status = 'Resolved - Pending customer confirmation'
                and date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        } else if (type == 'RequestA') {
            dates = `
                status = 'Request for authorization'
                and date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        } else if (type == 'Scheduled') {
            dates = `
                Scheduled
                for Review ' 
                and date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        } else {
            dates = `
                date(close_time) between '${start}'
                and '${end}'
                and sr_type != 'Change'
                `
        }
        console.log(dates);
        try {
            connection = await db.pool.getConnection();
            const query = `
                select * from tvc where ${ dates }
                `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }

    static async getOtherStatus() {

        let connection;

        try {
            connection = await db.pool.getConnection();
            const query = `
                select count(1) as tots,
                    COALESCE(sum(
                        case when status in ('In Progress', 'Review In Progress') then 1
                        else 0 end), 0) as InProgress,
                    COALESCE(sum(
                        case when status = 'New'
                        then 1
                        else 0 end), 0) as New,
                    COALESCE(sum(
                        case when status = 'Pending'
                        then 1
                        else 0 end), 0) as Pending

                from tvc where sr_type != 'Change'
                `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }


    //get ticket via srid
    static async getTicketSr(id) {

        let connection;

        try {
            connection = await db.pool.getConnection();
            const query = `
                select * from tvc where sr_id = '${id}'
                `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }

    static async getLeaderboard() {

        let connection;

        try {
            connection = await db.pool.getConnection();
            const query = `
                select UCASE(responsibility) as responsibility, COUNT( * ) as tots,
                    SUM(CASE WHEN status in ('Scheduled for Review', 'Request for authorization', 'Resolved - Pending customer confirmation', 'Validated for CAB', 'Approved for UAT', 'Declined - Incomplete Request') THEN 1 ELSE 0 END) AS Resolve,
                    SUM(CASE WHEN status in ('Scheduled for Review', 'Request for authorization', 'Resolved - Pending customer confirmation', 'Validated for CAB', 'Approved for UAT', 'Declined - Incomplete Request') THEN 1 ELSE 0 END) / COUNT( * ) * 100 AS Resolve_percentage,
                    SUM(CASE WHEN status in ('In Progress', 'Review In Progress') THEN 1 ELSE 0 END) AS InProgress,
                    SUM(CASE WHEN status in ('In Progress', 'Review In Progress') THEN 1 ELSE 0 END) / COUNT( * ) * 100 AS InProgress_percentage,
                    sum(
                        case when status = 'New'
                        then 1
                        else 0 end) as New,
                    SUM(CASE WHEN status = 'New'
                        THEN 1 ELSE 0 END) / COUNT( * ) * 100 AS New_percentage,
                    sum(
                        case when status = 'Pending'
                        then 1
                        else 0 end) as Pending,
                    SUM(CASE WHEN status = 'Pending'
                        THEN 1 ELSE 0 END) / COUNT( * ) * 100 AS Pending_percentage

                from tvc where responsibility != ''
                and sr_type != 'Change'
                GROUP BY responsibility ORDER BY Resolve DESC `;
            const [rows, fields] = await connection.query(query);
            let result;
            connection.release();
            console.log(rows);
            return rows.length ? [rows] : [
                []
            ]


        } catch (error) {
            connection.release();
            console.log(error);
            return [
                []
            ]

        }

    }

    static generateUniqueNumber() {
        const uuidv4 = uuid.v4(); // Generate a UUID
        const hexDigits = uuidv4.replace(/-/g, '').substr(0, 8); // Extract the first 8 hexadecimal digits
        const number = parseInt(hexDigits, 16); // Convert the hexadecimal digits to a decimal number
        return number;
    }

}




module.exports = PostData;