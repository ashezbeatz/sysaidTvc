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
                    const newqus =`update  tvc set old_status= ? ,status = ?, update_time= ?,close_time= ?, thirdLevelCategory =?
                    where sr_id=? `;
                    const vals = [rows[0].status,
                                    this.status,
                                    moment(this.update_time, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                                    PostData.formatDatetime(this.close_time),
                                    this.thirdLevelCategory,
                                    this.sr_id
                                ]
                                result =  await connection.query(newqus, vals)
                          if(rows[0].status === this.status) {
                            console.log('status not changed '+rows[0].status+" === "+this.status);
                          } else{
                           
                            console.log("update data : "+result+" : status :"+JSON.stringify(rows))
                          
                          }   
                          console.log("update data : "+result+" : status :"+JSON.stringify(rows))
                        
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
    static  formatDatetime(datetime) {
        if (!datetime) {
          return null;
        } else {
          const formattedDatetime = moment(datetime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          return formattedDatetime;
        }
      }

static async getData(){

  let connection;

  try {
    connection = await db.pool.getConnection();
    const query =`
    select count(1) as tots,sum(case when status ='Declined - Incomplete Request' then 1 else 0 end ) as Declined,
    sum(case when status ='Approved for UAT' then 1 else 0 end ) as UAT,
    sum(case when status ='Validated for CAB' then 1 else 0 end ) as CAB,
    sum(case when status ='Resolved - Pending customer confirmation' then 1 else 0 end ) as Resolved,
    sum(case when status ='Request for authorization' then 1 else 0 end ) as RequestA,
    sum(case when status ='Scheduled for Review' then 1 else 0 end ) as Scheduled
    
    from tvc where date(close_time) = CURDATE() 
                `;
      const [rows, fields] = await connection.query(query);
      let result;
      connection.release(); 
      console.log(rows);
     return  rows.length ? [rows] : [[]]

    
  } catch (error) {
    connection.release(); 
    console.log(error);
    return [[]]
    
  }

}


static async getDataNew(start,end,type){

  let connection;
let dates;
if(type=='Yesterday'){
  dates = `= CURDATE() - 1`
}else if (type=='Today'){
  dates = `= CURDATE()`
}
else{
  dates = `between '${start}' and '${end}'`
}
console.log(dates);
  try {
    connection = await db.pool.getConnection();
    const query =`
    select count(1) as tots,sum(case when status ='Declined - Incomplete Request' then 1 else 0 end ) as Declined,
    sum(case when status ='Approved for UAT' then 1 else 0 end ) as UAT,
    sum(case when status ='Validated for CAB' then 1 else 0 end ) as CAB,
    sum(case when status ='Resolved - Pending customer confirmation' then 1 else 0 end ) as Resolved,
    sum(case when status ='Request for authorization' then 1 else 0 end ) as RequestA,
    sum(case when status ='Scheduled for Review' then 1 else 0 end ) as Scheduled
    
    from tvc where date(close_time) ${dates}
                `;
      const [rows, fields] = await connection.query(query);
      let result;
      connection.release(); 
      console.log(rows);
     return  rows.length ? [rows] : [[]]

    
  } catch (error) {
    connection.release(); 
    console.log(error);
    return [[]]
    
  }

}


static async getDataNewStatus(start,end,type){

  let connection;
let dates;
if(type=='Declined'){
  dates = ` status ='Declined - Incomplete Request' 
  and date(close_time) between '${start}' and '${end}'  `
}else if (type=='UAT'){
  dates = `status ='Approved for UAT' 
  and date(close_time) between '${start}' and '${end}'`
}else if(type=='CAB'){
  dates = `status ='Validated for CAB' 
  and date(close_time) between '${start}' and '${end}'`
}else if(type =='New'){
  dates = `status ='New' 
 `
}
else if(type =='InProgress'){
  dates = `status in('In Progress' ,'Review In Progress') `
}
else if(type =='Resolved'){
  dates = `status ='Resolved - Pending customer confirmation' 
  and date(close_time) between '${start}' and '${end}'`
}
else if(type =='RequestA'){
  dates = `status ='Request for authorization' 
  and date(close_time) between '${start}' and '${end}'`
}
else if(type =='Scheduled'){
  dates = `Scheduled for Review' 
  and date(close_time) between '${start}' and '${end}'`
}
else{
  dates = `date(close_time) between '${start}' and '${end}'`
}
console.log(dates);
  try {
    connection = await db.pool.getConnection();
    const query =`
    select * from tvc where ${dates}
                `;
      const [rows, fields] = await connection.query(query);
      let result;
      connection.release(); 
      console.log(rows);
     return  rows.length ? [rows] : [[]]

    
  } catch (error) {
    connection.release(); 
    console.log(error);
    return [[]]
    
  }

}

static async getOtherStatus(){

  let connection;

  try {
    connection = await db.pool.getConnection();
    const query =`
    select count(1) as tots,
    sum(case when status in('In Progress' ,'Review In Progress')then 1 else 0 end ) as InProgress,
    sum(case when status ='New' then 1 else 0 end ) as New,
    sum(case when status ='Pending' then 1 else 0 end ) as Pending
    
    from tvc  
                `;
      const [rows, fields] = await connection.query(query);
      let result;
      connection.release(); 
      console.log(rows);
     return  rows.length ? [rows] : [[]]

    
  } catch (error) {
    connection.release(); 
    console.log(error);
    return [[]]
    
  }

}

static async getLeaderboard(){

  let connection;

  try {
    connection = await db.pool.getConnection();
    const query =`
    select responsibility,COUNT(*) as tots,
    SUM(CASE WHEN status in  ('Scheduled for Review','Request for authorization','Resolved - Pending customer confirmation','Validated for CAB','Approved for UAT','Declined - Incomplete Request') THEN 1 ELSE 0 END) AS Resolve,
    SUM(CASE WHEN status in  ('Scheduled for Review','Request for authorization','Resolved - Pending customer confirmation','Validated for CAB','Approved for UAT','Declined - Incomplete Request') THEN 1 ELSE 0 END) / COUNT(*) * 100 AS Resolve_percentage,
     SUM(CASE WHEN status  in ('In Progress' ,'Review In Progress') THEN 1 ELSE 0 END) AS InProgress,
      SUM(CASE WHEN status in ('In Progress' ,'Review In Progress') THEN 1 ELSE 0 END) / COUNT(*) * 100 AS InProgress_percentage,
     sum(case when status ='New' then 1 else 0 end ) as New,
      SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) / COUNT(*) * 100 AS New_percentage,
     sum(case when status ='Pending' then 1 else 0 end ) as Pending,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) / COUNT(*) * 100 AS Pending_percentage
    
    from tvc where responsibility !=''
     GROUP BY responsibility ORDER BY Resolve DESC  
                `;
      const [rows, fields] = await connection.query(query);
      let result;
      connection.release(); 
      console.log(rows);
     return  rows.length ? [rows] : [[]]

    
  } catch (error) {
    connection.release(); 
    console.log(error);
    return [[]]
    
  }

}

}




module.exports =PostData;