const rp = require('request-promise');
const tough = require('tough-cookie');
require("dotenv").config();
class SysAid {
  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
    this.cookieJar = rp.jar(new tough.CookieJar());
  }

  async login() {
    const options = {
      method: 'POST',
      uri: `${this.baseUrl}/api/login`,
      form: {
        userName: this.username,
        password: this.password,
        rememberMe: false
      },
      jar: this.cookieJar
    };

    try {
      const response = await rp(options);
      // Extract the JSESSIONID and SERVERID values from the cookie jar
      const cookies = this.cookieJar.getCookies(`${this.baseUrl}/api`);
      const jsessionId = cookies.find(cookie => cookie.key === 'JSESSIONID')?.value;
      const serverId = cookies.find(cookie => cookie.key === 'SERVERID')?.value;
      // Return the JSESSIONID and SERVERID values
      return { jsessionId, serverId };
    } catch (error) {
      console.error(error);
      throw new Error('Login failed');
    }
  }

  async getSR(srNumber) {
    // Check if the JSESSIONID and SERVERID values are available in the cookie jar
    const cookies = this.cookieJar.getCookies(`${this.baseUrl}/api`);
    const jsessionId = cookies.find(cookie => cookie.key === 'JSESSIONID')?.value;
    const serverId = cookies.find(cookie => cookie.key === 'SERVERID')?.value;
    if (jsessionId && serverId) {
      // If the JSESSIONID and SERVERID values are available, use them to make a request for the SR
      const options = {
        uri: `${this.baseUrl}/api/v1/sr/${srNumber}`,
        qs: {
          jsessionId,
          serverId
        },
        json: true,
        jar: this.cookieJar
      };

      try {
        const sr = await rp(options);
        return sr;
      } catch (error) {
        console.error(error);
        throw new Error('Unable to retrieve SR');
      }
    } else {
      // If the JSESSIONID and SERVERID values are not available, log in and try again
      await this.login();
      return this.getSR(srNumber);
    }
  }
}