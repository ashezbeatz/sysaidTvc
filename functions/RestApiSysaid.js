//const axios = require('axios');
const cookie = require('cookie');
const request = require('request-promise');

//const { cookie } = require('request');

require("dotenv").config();

class RestApiSysaid{

  static async authenticate() {
    try {
      // Check if there is an existing cookie
      const existingCookie = process.env.cookie;
      console.log(`Existing cookie: ${existingCookie}`);
      if (existingCookie) {
        let { JSESSIONID, SERVERID } = cookie.parse(existingCookie);
        console.log(`Using existing session:  JSESSIONID=${JSESSIONID};  SERVERID=${SERVERID}`);
        JSESSIONID= `JSESSIONID=${JSESSIONID}`
        SERVERID= `SERVERID=${SERVERID}`
        return { JSESSIONID, SERVERID};
      }
  console.log(`sysaid username : ${process.env.sysaidusername}`)
      // Authenticate and retrieve new cookie
      const options = {
        method: 'POST',
        uri: `${process.env.apiUrl}/login`,
        body: {
          user_name: `${process.env.sysaidusername}`,
          password: `${process.env.password}`
        },
        json: true,
        resolveWithFullResponse: true
      };
      const response = await request(options);
  
      const cookies = response.headers['set-cookie'];
      const JSESSIONID = cookies.find((cookie) => cookie.includes('JSESSIONID'));
      const SERVERID = cookies.find((cookie) => cookie.includes('SERVERID'));
      console.log(`New session: ${JSESSIONID}; ${SERVERID}`);
  
      // Create the new cookie
      const newCookie = `${JSESSIONID}; ${SERVERID}; Path=/; Secure; HttpOnly; SameSite=Lax`;
      console.log(`New cookie: ${newCookie}`);
  
      // Set the cookies in the environment variable for future requests
      process.env.cookie = newCookie;
      return { JSESSIONID, SERVERID };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to authenticate with SysAid API');
    }
  }
  /*static async authenticate() {
    try {
      // Check if there is an existing cookie
      const existingCookie = process.env.cookie;
      console.log(`Existing cookie: ${existingCookie}`);
      if (existingCookie) {
        let { JSESSIONID, SERVERID } = cookie.parse(existingCookie);
        console.log(`Using existing session:  JSESSIONID=${JSESSIONID};  SERVERID=${SERVERID}`);
         JSESSIONID= `JSESSIONID=${JSESSIONID}`
         SERVERID= `SERVERID=${SERVERID}`
       return { JSESSIONID, SERVERID};
      }

      // Authenticate and retrieve new cookie
      const response = await axios.post(`${process.env.apiUrl}/login`, {
        user_name: `${process.env.username}`,
        password: `${process.env.password}`
      });
    
      const cookies = response.headers['set-cookie'];
      const JSESSIONID = cookies.find((cookie) => cookie.includes('JSESSIONID'));
      const SERVERID = cookies.find((cookie) => cookie.includes('SERVERID'));
      console.log(`New session: ${JSESSIONID}; ${SERVERID}`);

      // Create the new cookie
      const newCookie = `${JSESSIONID}; ${SERVERID}; Path=/; Secure; HttpOnly; SameSite=Lax`;
      console.log(`New cookie: ${newCookie}`);

      // Set the cookies in the environment variable for future requests
      process.env.cookie = newCookie;
      return { JSESSIONID, SERVERID };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to authenticate with SysAid API');
    }
  }
  static async authenticate3() {
    try {
      // Check if there is an existing cookie
      const existingCookie = process.env.cookie;
      console.log(`Existing cookie: ${existingCookie}`);
      if (existingCookie) {
        const { JSESSIONID, SERVERID } = cookie.parse(existingCookie);
        console.log(`Using existing session: ${JSESSIONID}; ${SERVERID}`);
        return { JSESSIONID, SERVERID };
      }
  
      // Authenticate and retrieve new cookie
      const response = await axios.post(`${process.env.apiUrl}/login`, {
        user_name: `${process.env.username}`,
        password: `${process.env.password}`
      });
    
      const cookies = response.headers['set-cookie'];
      const JSESSIONID = cookies.find((cookie) => cookie.includes('JSESSIONID'));
      const SERVERID = cookies.find((cookie) => cookie.includes('SERVERID'));
      console.log(`New session: ${JSESSIONID}; ${SERVERID}`);
    
      // Set the cookies in the response object
      response.headers['set-cookie'] = [JSESSIONID, SERVERID].map((c) => cookie.parse(c));
  
      // Set the new cookie for the day
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 86400 // 1 day in seconds
      };
      const cookieString = cookie.serialize('session', response.headers['set-cookie'].join('; '), cookieOptions);
      process.env.cookie = cookieString;
    
      return { JSESSIONID, SERVERID };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to authenticate with SysAid API');
    }
  }*/
//username, password
static async authenticate2() {
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
  


  


  static async getSRDetailsNews(cookieObj, assignedGroupID) {
    try {
      const cookieString = `${cookieObj.JSESSIONID}; ${cookieObj.SERVERID}`;
      console.log("new cookies " + cookieString);
      const options = {
        method: "GET",
        uri: `${process.env.apiUrl}/sr`,
        qs: {
          fields: `${process.env.fields}`,
          assigned_group: assignedGroupID, // replace with the ID of the assigned group you want to filter by
        },
        headers: {
          Cookie: cookieString,
        },
        json: true,
      };
  
      const response = await request(options);
      // console.log("outssss : "+JSON.stringify(response))
      if (response) {
        //const data = JSON.parse(response);
        // code that uses the parsed data
        return JSON.stringify(response);
      } else {
        console.error(
          "Error retrieving SR details: Response is undefined"
        );
        return null;
      }
    } catch (error) {
      if (error.statusCode === 401) {
        console.log(
          "Non authenticated user error occurred. Calling auth function..."
        );
        const authResponse = await this.authenticate();
        const cookieObj = JSON.parse(authResponse);
        const srDetailsResponse = await this.getSRDetailsNew(
          cookieObj,
          assignedGroupID
        );
        return srDetailsResponse;
      } else {
        console.error(`Error retrieving SR details: ${error}`);
        return null;
      }
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
      
     // console.log("outssss : "+JSON.stringify(response))
     if (response) {
      //const data = JSON.parse(response);
      // code that uses the parsed data
      return JSON.stringify(response);
    } else {
      console.error('Error retrieving SR details: Response is undefined');
      return null;
    }
     
    } 
    catch (error) {
      if (error.name === 'StatusCodeError' && error.statusCode === 401 && error.message.includes('Non authenticated user')) {
        console.log('Authentication required. Authenticating...');
        const { JSESSIONID, SERVERID } = await this.authenticate();
        console.log('Retrying the request with the new cookie...');
        return await this.getSRDetailsNew({ JSESSIONID, SERVERID }, assignedGroupID);
      } else {
        console.error(`Error retrieving SR details: ${error}`);
        return null;
      }
    }
    /*catch (error) {
      console.error(`Error retrieving SR details: ${error}`);
      return null;
    }*/
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