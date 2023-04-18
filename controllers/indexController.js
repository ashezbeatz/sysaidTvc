
require("dotenv").config();
const RestSysaidApi = require('../functions/RestApiSysaid');
const jsonCon =  require('../models/jsonConverter')
const sysAid =  require('../functions/SysAidAPI')
const sysAidNew  = require('../functions/SysAidRestApiNew');
const PostData = require('../models/queries')

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
       // const sessionId = await sysAidNew.authenticate();
    /*   const assignedGroupID = `${process.env.assigned_group}`;
      const { JSESSIONID, SERVERID } = await sysAidNew.authenticate();
       const srList = await sysAidNew.getSRDetailsNew({ JSESSIONID, SERVERID }, assignedGroupID);
 */
           jsonCon.decodeResponse(srList);
           //console.log("output New : "+ JSON.parse(srList))
          // const response = JSON.parse(responseData);
            res.send("Hello from Index Controller")
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async curData(req,res,next){

      try {
        let [data] =await PostData.getData();
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        next(error) 
    }
    }
    static async otherStatus(req,res,next){

      try {
        let [data] =await PostData.getOtherStatus();
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        next(error) 
    }
    }
    static async Leaderboard(req,res,next){

      try {
        let [data] =await PostData.getLeaderboard();
        res.status(200).json({data})
    } catch (error) {
        console.log(error)
        next(error) 
    }
    }

}


module.exports = IndexController;