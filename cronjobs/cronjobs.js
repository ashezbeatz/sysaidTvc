const RestSysaidApi = require('../functions/RestApiSysaid');
const jsonCon =  require('../models/jsonConverter')
async function runCrons(){
try {
    const sessionId = await RestSysaidApi.authenticate();
    // const sessionId = await RestSysaidApi.authenticate();
   //  console.log(`session id : ${sessionId}`);
     const assignedGroupID = `${process.env.assigned_group}`;
     const srList  = await RestSysaidApi.getSRDetailsNew(sessionId,assignedGroupID)
     jsonCon.decodeResponse(srList);
} catch (error) {
    console.log("crons : "+error)
}
   


}

module.exports ={
    runCrons
}

