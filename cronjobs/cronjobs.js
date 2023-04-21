const RestSysaidApi = require('../functions/RestApiSysaid');
const jsonCon =  require('../models/jsonConverter')
const PostData = require('../models/queries')
async function runCrons(){
try {
    const sessionId = await RestSysaidApi.authenticate();
    // const sessionId = await RestSysaidApi.authenticate();
   //  console.log(`session id : ${sessionId}`);
     const assignedGroupID = `${process.env.assigned_group}`;
     const srList  = await RestSysaidApi.getSRDetailsNew(sessionId,assignedGroupID)
    await jsonCon.decodeResponse(srList);

    const loops = await PostData.getSRS()
    //console.log(loops)
    loops.forEach(async item => {
     // console.log("asdasda"+item.sr_id);

     const srDetails = await RestSysaidApi.getSRPerDetailsNew(sessionId,item.sr_id);
       //console.log("sr Details "+srDetails)
       await jsonCon.decodeSRDetailsResponse(srDetails)
  
   });




} catch (error) {
    console.log("crons : "+error)
}
   


}

module.exports ={
    runCrons
}

