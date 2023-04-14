const db = require('../configuration/Database');
const moment = require('moment');

class PostData{
    constructor(sr_id,thirdLevelCategory,update_time,responsibility,request_user,assigned_group_code,
        assigned_group,insert_time,company,close_time,sr_type,sr_weight,status,
        status_code )
        {

            this.sr_id=sr_id,
            this.thirdLevelCategory = thirdLevelCategory,
            this.update_time = update_time,
            this.responsibility = responsibility,
            this.request_user = request_user,
            this.assigned_group_code = assigned_group_code,
            this.assigned_group = assigned_group,
            this.insert_time = insert_time,
            this.company = company,
            this.close_time =close_time,
            this.sr_type = sr_type,
            this.sr_weight = sr_weight,
            this.status = status,
            this.status_code = status_code
         }

         
    async saveData()
    {
        let connection;
        try {

            connection = await db.pool.getConnection();
      
            const query = 'SELECT sr_id,status FROM tvc WHERE sr_id = ?';
            const values2 = [ this.sr_id];
            const sql =`
                INSERT INTO tvc(sr_id,
                    thirdLevelCategory,
                    update_time,responsibility,request_user,assigned_group_code,
                    assigned_group,insert_time,company,close_time,sr_type,sr_weight,
                    status,status_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `;
            
            const values =[
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
                    const newqus =`update  tvc set old_status= ? ,status =?, update_time= ?
                    where sr_id=? `;
                    const vals = [rows[0].status,
                                    this.status,
                                    moment(this.update_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                                    this.sr_id
                                ]
                          if(rows[0].status === this.status) {
                            console.log('status not changed '+rows[0].status+" === "+this.status);
                          } else{
                            result =  await connection.query(newqus, vals)
                            console.log("update data : "+result+" : status :"+JSON.stringify(rows))
                            connection.release();
                          }   
                        
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
    static  formatDatetime(datetime) {
        if (!datetime) {
          return null;
        } else {
          const formattedDatetime = moment(datetime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          return formattedDatetime;
        }
      }
    

}




module.exports =PostData;