
const PostData = require('./queries')
 async function decodeResponse(response){

    const data = JSON.parse(response);
    if (data !== null) {
data.forEach(async obj => {
    console.log(obj.id);
    const firstObjInfo = obj.info;
    console.log("info data : "+ JSON.stringify(firstObjInfo));
    const sr_id =obj.id;
    const thirdLevelCategory = firstObjInfo[0].value;
    const update_time = firstObjInfo[1].valueCaption;
    const responsibility = firstObjInfo[2].valueCaption;
    const ASSIGN = firstObjInfo[2].keyCaption;
    const request_user = firstObjInfo[3].valueCaption;
    const assigned_group_code = firstObjInfo[4].value;
    const assigned_group = firstObjInfo[4].valueCaption;
    const insert_time = firstObjInfo[5].valueCaption;
    const company = firstObjInfo[6].valueCaption;
    const close_time = firstObjInfo[7].valueCaption;
    const sr_type = firstObjInfo[8].valueCaption;
    const sr_weight = firstObjInfo[9].valueCaption;
    const status = firstObjInfo[10].valueCaption;
    const status_code = firstObjInfo[10].value;
    console.log("thirdLevelCategory : "+thirdLevelCategory);
    console.log("update_time : "+update_time);
    console.log("responsibility : "+responsibility);
    console.log("request_user : "+request_user);
    console.log(" assigned_group_code : "+assigned_group_code+" assigned_group : "+assigned_group);
    console.log(" insert_time : "+insert_time);
    console.log(" company : "+company);
    console.log(" close_time : "+close_time);
    console.log(" sr_type : "+sr_type);
    console.log(" sr_weight : "+sr_weight);
    console.log(" status : "+status +" status_code : "+status_code);
    let psData = new PostData(sr_id,thirdLevelCategory,update_time,responsibility,request_user,assigned_group_code,
        assigned_group,insert_time,company,close_time,sr_type,sr_weight,status,
        status_code);
        psData = await psData.saveData()
//    for (const item of firstObjInfo) {
//     console.log(`${item.key}: ${item.value}  - ${item.valueCaption}`);
//   }
  });
    }else{
        console.log("empty array")
    }
 }

 module.exports = {
    decodeResponse
 }