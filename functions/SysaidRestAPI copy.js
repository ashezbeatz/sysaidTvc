const axios = require('axios');
const cookieSession = require('cookie-session');

class SysaidRestAPI {
    constructor(username, password) {
      this.username = process.env.username;
      this.password = process.env.password;
      this.baseUrl = process.env.apiUrl;
      this.cookieName = 'sysaid_cookies';
      this.cookieSession = cookieSession({
        name: this.cookieName,
        keys: [process.env.COOKIE_SECRET],
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }
  
    async login() {
      try {
        const response = await axios.post(`${this.baseUrl}/login`, {
          username: this.username,
          password: this.password,
        });
        const cookies = response.headers['set-cookie'];
        const sysaidCookies = {};
        cookies.forEach((cookie) => {
          if (cookie.includes('JSESSIONID') || cookie.includes('SERVERID')) {
            const [key, value] = cookie.split(';')[0].split('=');
            sysaidCookies[key] = value;
          }
        });
        return sysaidCookies;
      } catch (error) {
        console.error('Failed to log in to SysAid API', error);
        throw error;
      }
    }
  
    async getSessionCookies() {
      const cookies = this.cookieSession.get(this.cookieName) || {};
      if (!cookies.JSESSIONID || !cookies.SERVERID) {
        const newCookies = await this.login();
        this.cookieSession.set(this.cookieName, newCookies);
        return newCookies;
      }
      return cookies;
    }
  
    async getSRDetails(assignedGroupID) {
      try {
        const cookies = await this.getSessionCookies();
        const response = await axios.get(`${this.baseUrl}/sr`, {
          params: {
            fields: process.env.SR_FIELDS,
            assigned_group: assignedGroupID,
          },
          headers: {
            Cookie: `JSESSIONID=${cookies.JSESSIONID}; SERVERID=${cookies.SERVERID}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Failed to get SR details from SysAid API', error);
        throw error;
      }
    }
  }
  
  module.exports = SysaidRestAPI;