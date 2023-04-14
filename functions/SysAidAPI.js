const axios = require('axios');
require("dotenv").config();
class SysAidAPI {
    constructor() {
      this.username = `${process.env.username}`;
      this.password = `${process.env.password}`;
      this.baseURL = process.env.apiUrl;
      this.loginConfig = {
        method: 'post',
        url: `${this.baseURL}/login`,
        data: {
          user_name: this.username,
          password: this.password
        },
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };
      this.srConfig = {
        method: 'get',
        url: `${this.baseURL}/v1/sr`,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };
    }
  
    static async loginAndGetCookies() {
      try {
        // Make the SysAid login API request using Axios and await the response
        const loginResponse = await axios(this.loginConfig);
        const cookies = loginResponse.headers['set-cookie'];
        const JSESSIONID = cookies.find((cookie) => cookie.includes('JSESSIONID'));
        const SERVERID = cookies.find((cookie) => cookie.includes('SERVERID'));
            console.log(`${JSESSIONID}; ${SERVERID}`)
        // Return the JSESSIONID and SERVERID cookies as an object
        return {
          JSESSIONID,
          SERVERID
        };

      } catch (error) {
        console.error(error);
      }
    }
  
    static async  getSRData(assignedGroup) {
      try {
        // Call the loginAndGetCookies function to get the JSESSIONID and SERVERID cookies
        const cookieObj = await this.loginAndGetCookies();
  
        // Set the JSESSIONID and SERVERID cookies for the SysAid SR API request
        const cookieString = `${cookieObj.JSESSIONID}; ${cookieObj.SERVERID}`;
        this.srConfig.headers.Cookie = cookieString;
  
        // Set the query parameters for the SysAid SR API request to retrieve SR data
        this.srConfig.params = {
          fields: `${process.env.fields}`,
          assigned_group: assignedGroup
        };
  
        // Make the SysAid SR API request using Axios and await the response
        const srResponse = await axios(this.srConfig);
        const srData = srResponse.data;
        console.log(srData);

        return srData;
      } catch (error) {
        console.error(error);
      }
    }
  }
  

  module.exports = SysAidAPI