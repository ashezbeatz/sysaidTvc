const axios = require('axios');
const cookie = require('cookie');

class SysAidRestApiNew {
  static async authenticate() {
    try {
      // Check if there is an existing cookie
      const existingCookie = process.env.cookie;
      console.log(`Existing cookie: ${existingCookie}`);
      if (existingCookie) {
        let { JSESSIONID, SERVERID } = cookie.parse(existingCookie);
        console.log(`Using existing session:  JSESSIONID=${JSESSIONID};  SERVERID=${SERVERID}`);
        JSESSIONID= `JSESSIONID=${JSESSIONID}`;
        SERVERID= `SERVERID=${SERVERID}`;
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

  static async getSRDetailsNew(cookieObj, assignedGroupID) {
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

      const response = await axios(options);
      
      if (response.status === 401) {
        console.error(`Error retrieving SR details: ${response.data.message}`);
        throw new Error(response.data.solution);
      }

      if (response) {
        return JSON.stringify(response.data);
      } else {
        console.error('Error retrieving SR details: Response is undefined');
        return null;
      }
    } catch (error) {
      console.error(`Error retrieving SR details: ${error}`);
      return null;
    }
  }
}

module.exports = SysAidRestApiNew;