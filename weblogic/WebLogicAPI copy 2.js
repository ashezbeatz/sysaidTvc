const rp = require('request-promise-native');
class WebLogicAPI {
    constructor(hostname, username, password, cluster, teamid, location) {
        this.hostname = hostname;

        this.username = username;
        this.password = password;
        this.cluster = cluster;
        this.teamid = teamid;
        this.location = location

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

}