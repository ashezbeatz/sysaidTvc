const request = require('request-promise');

require("dotenv").config();

class RestApiSysaid{

//username, password
static async authenticate() {
    return new Promise(async (resolve, reject) => {
        try {
          const options = {
            method: 'POST',
            uri: `${process.env.apiUrl}/login`,
            body: {
              user_name: `${process.env.username}`,
              password: `${process.env.password}`
            },
            json: true
          };
          console.log(`options Login : ${options} `)
          const response = await request(options);
          const headers = response.headers;

          const sessionId = response.sessionId;
            console.log("new reponse"+JSON.stringify(response));
            console.log("headers"+headers);
          resolve(sessionId);
        } catch (error) {
          reject(error);
        }
      });

    }

    static async getSRDetails(sessionId, assignedGroupID) {
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