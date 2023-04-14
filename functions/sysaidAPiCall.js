
const axios = require('axios');
require("dotenv").config();
class Apicall{

constructor(username, password, assignedGroup){
    this.username = username;
    this.password = password;
    this.assignedGroup = assignedGroup;

}

static async getSr(){
    const apiUrl = `${proccess.env.apiUrl}/sr`;
    const queryParams = {
      fields: `${process.env.fields}`,
      assigned_group: this.assignedGroup
    };
  
    // Set the Basic Authentication header
    const authHeader = {
      username: this.username,
      password: this.password
    };

console.log(`apiUrl : ${apiUrl} || queryParams : ${queryParams} ||  authHeader : ${authHeader}`)
    /*return axios.get(apiUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${authHeader.username}:${authHeader.password}`).toString('base64')}`
        },
        params: queryParams
      })
        .then(response => {
          // Return the response data
          return response.data;
        })
        .catch(error => {
          // Handle the error
          console.error(error);
        });*/

          // Return a Promise that resolves with the response data or rejects with an error
    return new Promise(async (resolve, reject) => {
    await axios.get(apiUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${authHeader.username}:${authHeader.password}`).toString('base64')}`
      },
      params: queryParams
    })
      .then(response => {
        console(response.data)
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
  
}



}



module.exports = Apicall;