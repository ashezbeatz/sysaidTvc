
const response = '[{"id":"1292033","canUpdate":true,"canDelete":false,"canArchive":false,"hasChildren":false,"info":[{"key":"third_level_category","value":"Test Case Review - Enrichment - Major(Projects)","valueClass":"","valueCaption":"Test Case Review - Enrichment - Major(Projects)","keyCaption":"Third Level Category"},{"key":"update_time","value":1678288179000,"valueClass":"","valueCaption":"08-03-2023 15:09:39","keyCaption":"Modify time"},{"key":"responsibility","value":7533,"valueClass":"","valueCaption":"Sebastian AIDOO","keyCaption":"Assigned to"},{"key":"request_user","value":3189,"valueClass":"","valueCaption":"Papa FALL","keyCaption":"Initiator"},{"key":"assigned_group","value":9957,"valueClass":"","valueCaption":"Unified Testing and Versioning","keyCaption":"Support Group"},{"key":"insert_time","value":1677871110000,"valueClass":"","valueCaption":"03-03-2023 19:18:30","keyCaption":"Request time"},{"key":"company","value":13,"valueClass":"","valueCaption":"EPI","keyCaption":"Affiliate"},{"key":"close_time","value":1678288066000,"valueClass":"","valueCaption":"08-03-2023 15:07:46","keyCaption":"Close time"},{"key":"sr_type","value":10,"valueClass":"","valueCaption":"Request","keyCaption":"Service Record Type"},{"key":"sr_weight","value":0,"valueClass":"","valueCaption":"0","keyCaption":"Weight"},{"key":"status","value":13,"valueClass":1,"valueCaption":"Declined - Incomplete Request","keyCaption":"Status"}]},{"id":"1242113","canUpdate":true,"canDelete":false,"canArchive":false,"hasChildren":false,"info":[{"key":"third_level_category","value":"Test Case Review - Enrichment -Minor (Fixes or added services)","valueClass":"","valueCaption":"Test Case Review - Enrichment -Minor (Fixes or added services)","keyCaption":"Third Level Category"},{"key":"update_time","value":1676285662000,"valueClass":"","valueCaption":"13-02-2023 10:54:22","keyCaption":"Modify time"},{"key":"responsibility","value":7533,"valueClass":"","valueCaption":"Sebastian AIDOO","keyCaption":"Assigned to"},{"key":"request_user","value":33712,"valueClass":"","valueCaption":"Margaret TAMAKLOE","keyCaption":"Initiator"},{"key":"assigned_group","value":9957,"valueClass":"","valueCaption":"Unified Testing and Versioning","keyCaption":"Support Group"},{"key":"insert_time","value":1675326201000,"valueClass":"","valueCaption":"02-02-2023 08:23:21","keyCaption":"Request time"},{"key":"company","value":13,"valueClass":"","valueCaption":"EPI","keyCaption":"Affiliate"},{"key":"close_time","value":null,"valueClass":"","valueCaption":"","keyCaption":"Close time"},{"key":"sr_type","value":10,"valueClass":"","valueCaption":"Request","keyCaption":"Service Record Type"},{"key":"sr_weight","value":0,"valueClass":"","valueCaption":"0","keyCaption":"Weight"},{"key":"status","value":7,"valueClass":2,"valueCaption":"Deleted","keyCaption":"Status"}]}]';
const data = JSON.parse(response);

data.forEach(obj => {
    console.log(obj.id);
    const firstObjInfo = obj.info;
    console.log("info data : "+ JSON.stringify(firstObjInfo));
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

//    for (const item of firstObjInfo) {
//     console.log(`${item.key}: ${item.value}  - ${item.valueCaption}`);
//   }
  });


