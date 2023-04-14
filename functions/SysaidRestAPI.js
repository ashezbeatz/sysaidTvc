const request = require('request-promise');
const tough = require('tough-cookie');
const cookiejar = new tough.CookieJar();
const cookie = require('cookie');
const axios = require('axios');
require("dotenv").config();
class SysAidRestAPI {

   static  async  authenticate() {
        try {
          const response = await axios.post(`${process.env.apiUrl}/login`, {
            user_name: `${process.env.username}`,
            password: `${process.env.password}`
          });
      
          const cookies = response.headers['set-cookie'];
          const JSESSIONID = cookies.find((cookie) => cookie.includes('JSESSIONID'));
          const SERVERID = cookies.find((cookie) => cookie.includes('SERVERID'));
          console.log(`sessions : ${JSESSIONID}; ${SERVERID}`)
      
          // Set the cookies in the Node.js environment
          const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 86400 // 1 day in seconds
          };
          const cookieString = cookie.serialize('JSESSIONID', JSESSIONID, cookieOptions) + '; ' +
                               cookie.serialize('SERVERID', SERVERID, cookieOptions);
          // Set the cookies in the response header
          response.headers['set-cookie'] = [cookieString];
      
          return { JSESSIONID, SERVERID };
        } catch (error) {
          console.error(error);
          throw new Error('Failed to authenticate with SysAid API');
        }
      }

     static async  getSRDetailsNew(cookieObj, assignedGroupID) {
        try {
          let cookieString;
          if (cookieObj && cookieObj.JSESSIONID && cookieObj.SERVERID) {
            cookieString = `${cookieObj.JSESSIONID}; ${cookieObj.SERVERID}`;
          } else {
            const authResult = await authenticate();
            cookieString = `${authResult.JSESSIONID}; ${authResult.SERVERID}`;
          }
      
          console.log("new cookies "+ cookieString);
          
          const options = {
            method: 'GET',
            uri: `${process.env.apiUrl}/sr`,
            qs: {
              fields: `${process.env.fields}`,
              assigned_group: assignedGroupID // replace with the ID of the assigned group you want to filter by
            },
            headers: {
              Cookie: cookieString,
            },
            json: true
          };
      
          const response = await request(options);
            
          console.log("outssss : "+JSON.stringify(response))
          return JSON.stringify(response);
        } catch (error) {
          console.error(`Error retrieving SR details: ${error}`);
        }
      }
      

}

module.exports = SysAidRestAPI;
