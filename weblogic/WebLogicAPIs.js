const request = require('request');

class WebLogicAPIs {
    constructor(url, username, password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }

    _makeRequest(options) {
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else if (response.statusCode === 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(`Request failed. Status: ${response.statusCode}`);
                }
            });
        });
    }

    async getServerNames() {
        const endpoint = `${this.url}/management/weblogic/latest/servers`;
        const options = {
            url: endpoint,
            auth: {
                user: this.username,
                pass: this.password,
                sendImmediately: true
            }
        };
        try {
            const response = await this._makeRequest(options);
            return response.items.map(server => server.name);
        } catch (error) {
            console.error('Failed to retrieve server names:', error);
            return [];
        }
    }

    async getApplicationDetails(serverName) {
        const endpoint = `${this.url}/management/weblogic/latest/domainRuntime/serverRuntimes/${serverName}/applicationRuntimes`;
        const options = {
            url: endpoint,
            auth: {
                user: this.username,
                pass: this.password,
                sendImmediately: true
            }
        };
        try {
            const response = await this._makeRequest(options);
            return response;
        } catch (error) {
            console.error(`Failed to retrieve deployment info for server ${serverName}:`, error);
        }
    }

    async fetchApplicationDetails() {
        try {
            const serverNames = await this.getServerNames();
            const applicationDetails = [];
            for (const serverName of serverNames) {
                const deploymentInfo = await this.getApplicationDetails(serverName);
                if (deploymentInfo && deploymentInfo.items) {
                    for (const app of deploymentInfo.items) {
                        const applicationName = app.name;
                        const deploymentDate = app.lastDeploymentTime || 'N/A';
                        const deploymentSize = app.size || 'N/A';
                        const details = {
                            serverName,
                            applicationName,
                            deploymentDate,
                            deploymentSize
                        };
                        applicationDetails.push(details);
                    }
                }
            }
            return applicationDetails;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
module.exports = WebLogicAPIs;