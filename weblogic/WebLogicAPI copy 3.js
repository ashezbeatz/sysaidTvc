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
            const appList = [];
            serverRuntimes.items.forEach((serverRuntime) => {
                serverRuntime.applicationRuntimes.items.forEach((appRuntime) => {
                    let appSize = appRuntime.size;
                    let appSizeUnit = 'bytes';

                    if (appSize >= 1000000000) {
                        appSize = (appSize / 1000000000).toFixed(2);
                        appSizeUnit = 'GB';
                    } else if (appSize >= 1000000) {
                        appSize = (appSize / 1000000).toFixed(2);
                        appSizeUnit = 'MB';
                    } else if (appSize >= 1000) {
                        appSize = (appSize / 1000).toFixed(2);
                        appSizeUnit = 'KB';
                    }

                    console.log(`Application: ${appRuntime.name}, Size: ${appSize} ${appSizeUnit}, Deployment Time: ${appRuntime.timestamp}`);


                });
            });
        } catch (err) {
            console.error(`Failed to connect to WebLogic: ${err}`);
        }
    }
}

//const weblogic = new WebLogicAPI('remote-weblogic-server-hostname', 7001, 'weblogic', 'weblogic');
//weblogic.getDeployedApplications();


module.exports = WebLogicAPI;