
require("dotenv").config();
const RestSysaidApi = require('../functions/RestApiSysaid');
const jsonCon =  require('../models/jsonConverter')
//const sysAid =  require('../functions/SysAidAPI')
//const sysAidNew  = require('../functions/SysAidRestApiNew');
const PostData = require('../models/queries')

class IndexController{

    static async index(req,res,next){
        try {

            const sessionId = await RestSysaidApi.authenticate();
           // const sessionId = await RestSysaidApi.authenticate();
          //  console.log(`session id : ${sessionId}`);
            const assignedGroupID = `${process.env.assigned_group}`;
            const srList  = await RestSysaidApi.getSRDetailsNew(sessionId,assignedGroupID)
          
           jsonCon.decodeResponse(srList);
           //1292033
          // const srDetails = await RestSysaidApi.getSRPerDetailsNew(sessionId,1338657);
          // console.log(srDetails)
           //jsonCon.decodeSRDetailsResponse(srDetails)
           const loops = await PostData.getSRS()
           //console.log(loops)
           loops.forEach(async item => {
            // console.log("asdasda"+item.sr_id);

            const srDetails = await RestSysaidApi.getSRPerDetailsNew(sessionId,item.sr_id);
              //console.log("sr Details "+srDetails)
              jsonCon.decodeSRDetailsResponse(srDetails)
         
          });
           //console.log("output New : "+ JSON.parse(srList))
          // const response = JSON.parse(responseData);
            res.send("Hello from Index Controller")
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async curData(req,res,next){
      /*console.log('Received a GET request!');
      console.log('req.method:', req.method);
      console.log('req.url:', req.url);
      console.log('req.headers:', req.headers);
      console.log('req.query:', req.query);*/
      const { start, end, type } = req.query;
      console.log('start:', start);
      try {
      
     
        let [data] =await PostData.getDataNew(start,end,type);
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


    static async getStatus(req,res,next){
      console.log('Received a GET request!');
      console.log('req.method:', req.method);
      console.log('req.url:', req.url);
      console.log('req.headers:', req.headers);
      console.log('req.query:', req.query);
      const { start, end, type } = req.query;
      console.log('start:', start);
      try {
      
     
        let [data] =await PostData.getDataNewStatus(start,end,type);
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