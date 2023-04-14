
require("dotenv").config();
const RestSysaidApi = require('../functions/RestApiSysaid');
const jsonCon =  require('../models/jsonConverter')
const sysAid =  require('../functions/SysAidAPI')

class IndexController{

    static async index(req,res,next){
        try {

            const sessionId = await RestSysaidApi.authenticate();
           // const sessionId = await RestSysaidApi.authenticate();
          //  console.log(`session id : ${sessionId}`);
            const assignedGroupID = `${process.env.assigned_group}`;
            const srList  = await RestSysaidApi.getSRDetailsNew(sessionId,assignedGroupID)
            //const srList = await RestSysaidApi.getSRs(sessionId, assignedGroupID);
          //  console.log("response :  "+srList);
        // console.log("output New : "+ srList)
           jsonCon.decodeResponse(srList);
           //console.log("output New : "+ JSON.parse(srList))
          // const response = JSON.parse(responseData);
            res.send("Hello from Index Controller")
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}


module.exports = IndexController;