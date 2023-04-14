const request = require('request-promise');
const axios = require('axios');
const { cookie } = require('request');
require("dotenv").config();

class RestApiSysaid{

//username, password
static async authenticate() {
    try {
        const response = await axios.post(`${process.env.apiUrl}/login`, {
            user_name: `${process.env.username}`,
            password: `${process.env.password}`
        });
    
        //const accessToken = response.data.access_token;
       // console.log("token :"+response.data.toString())
     //  console.log(`Header: ${JSON.stringify(response)}`);
       //console.log(response.headers);
    //    console.log(`Response data: ${JSON.stringify(response.data)}`);
    const cookies = response.headers['set-cookie'];
    const JSESSIONID = cookies.find((cookie) => cookie.includes('JSESSIONID'));
    const SERVERID = cookies.find((cookie) => cookie.includes('SERVERID'));
    console.log(`sessions : ${JSESSIONID}; ${SERVERID}`)
        //return  `${JSESSIONID}; ${SERVERID}`;
        return {
            JSESSIONID,
            SERVERID
          };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to authenticate with SysAid API');
      }
}

static async getSRDetails(cookieObj, assignedGroupID) {
    try {
      // Set the JSESSIONID and SERVERID cookies for the SysAid SR API request
      const cookieString = `${cookieObj.JSESSIONID}; ${cookieObj.SERVERID}`;
      console.log("new cookies "+ cookieString)
      const headers = {
        Cookie: cookieString,
        'Content-Type': 'application/json'
      };
  
      // Set the query parameters for the SysAid SR API request to retrieve SR data
      const params = {
        fields: `${process.env.fields}`,
        assigned_group: assignedGroupID
      };
  
      // Make the SysAid SR API request using Axios and await the response
      const response = await axios.get(`${process.env.apiUrl}/sr`, {
        headers,
        params,
        withCredentials: true
      });
      console.log("output : "+ JSON.parse(response.data))
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  
  
  
  static async  getSRDetailsNew(cookieObj, assignedGroupID) {
    try {
        const cookieString = `${cookieObj.JSESSIONID}; ${cookieObj.SERVERID}`;
        console.log("new cookies "+ cookieString)
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
  

    static async getSRDetails2(sessionId, assignedGroupID) {
    return new Promise(async (resolve, reject) => {
      try {
       /* const options = {
          method: 'GET',
          uri: `https://yourdomain.sysaidit.com/api/sr/${srID}`,
          headers: {
            sessionId: sessionId
          },
          json: true
        };*/
        const options = {
            method: 'GET',
            uri: `${process.env.apiUrl}/sr`,
            qs: {
              fields: `${process.env.fields}`,
              assigned_group: assignedGroupID
            },
            headers: {
              sessionId: sessionId
            },
            json: true
          };
          
          console.log(`options : ${options} `)
        const response = await request(options);
        
    
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

}


module.exports = RestApiSysaid