const rp = require('request-promise-native');
class WebLogicAPI {
    constructor(hostname, port, username, password) {
        this.hostname = hostname;
        this.port = port;
        this.username = username;
        this.password = password;
    }

    async getDeployedApplications() {
        const restOptions = {
            uri: `${this.hostname}/management/weblogic/latest/domainRuntime/serverRuntimes`,
            auth: {
                user: this.username,
                pass: this.password,
                sendImmediately: false
            },
            json: true
        };

        try {
            const serverRuntimes = await rp(restOptions);
            serverRuntimes.items.forEach((serverRuntime) => {
                serverRuntime.applicationRuntimes.items.forEach((appRuntime) => {
                    console.log(`Application: ${appRuntime.name}, Size: ${appRuntime.size}, Deployment Time: ${appRuntime.timestamp}`);
                });
            });
        } catch (err) {
            console.error(`Failed to connect to WebLogic: ${err}`);
        }
    }
    static async getDeployedApplicationsold() {
        const restOptions = {
            uri: `http://${this.hostname}:${this.port}/management/weblogic/latest/domainRuntime/serverRuntimes`,
            auth: {
                user: this.username,
                pass: this.password,
                sendImmediately: false
            },
            json: true
        };

        try {
            const serverRuntimes = await rp(restOptions);
            serverRuntimes.items.forEach((serverRuntime) => {
                serverRuntime.applicationRuntimes.items.forEach((appRuntime) => {
                    console.log(`Application: ${appRuntime.name}, Size: ${appRuntime.size}, Deployment Time: ${appRuntime.timestamp}`);
                });
            });
        } catch (err) {
            console.error(`Failed to connect to WebLogic: ${err}`);
        }
    }
}