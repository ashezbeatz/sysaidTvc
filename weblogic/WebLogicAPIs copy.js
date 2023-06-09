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

    async getApplicationInfo(applicationName) {
        const endpoint = `${this.url}/edit/appDeployments/${applicationName}`;
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
            console.error(`Failed to retrieve deployment info for ${applicationName}:`, error);
        }
    }

    async getAllApplications() {
        const endpoint = `${this.url}/edit/appDeployments`;
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
            return response.items || []; // Ensure that `items` is an iterable array or use an empty array as default
        } catch (error) {
            console.error('Failed to retrieve applications:', error);
            return [];
        }
    }

    async fetchApplicationDetails() {
        try {
            const applications = await this.getAllApplications();
            const applicationDetails = [];
            for (const app of applications) {
                const applicationName = app.name;
                console.log(`applications names ${applicationName}`)
                const deploymentInfo = await this.getApplicationInfo(applicationName);
                if (deploymentInfo) {
                    // const deploymentDate = deploymentInfo.properties.lastDeploymentTime;
                    // const deploymentSize = deploymentInfo.properties.deploymentSize;
                     const deploymentDate = deploymentInfo.properties?.lastDeploymentTime?.toString();
                    const deploymentSize = deploymentInfo.properties?.deploymentSize?.toString();
        
                    const details = {
                        applicationName,
                        // deploymentDate,
                        // deploymentSize
                        deploymentDate: deploymentDate || 'N/A',
                        deploymentSize: deploymentSize || 'N/A'
                    };
                    applicationDetails.push(details);
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