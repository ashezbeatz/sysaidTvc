const rp = require('request-promise-native');
const warCheckerData = require('../models/warcheckqueries')
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
            uri: `${this.hostname}/management/weblogic/latest/domainRuntime/deploymentManager/appDeploymentRuntimes`,
            auth: {
                user: this.username,
                pass: this.password,
                sendImmediately: false
            },
            json: true
        };

        try {
            const appDeploymentRuntimes = await rp(restOptions);
            const appList = [];
            const currentTime = new Date();

            for (const appRuntime of appDeploymentRuntimes.items) {
                const appSize = appRuntime.archiveSize;

                let appSizeUnit;
                if (appSize >= 1000000000) {
                    appSizeUnit = 'GB';
                } else if (appSize >= 1000000) {
                    appSizeUnit = 'MB';
                } else if (appSize >= 1000) {
                    appSizeUnit = 'KB';
                } else {
                    appSizeUnit = 'bytes';
                }

                const formattedSize = `${(appSize / 1024).toFixed(2)} ${appSizeUnit}`;

                console.log(`Application: ${appRuntime.name}, Size: ${formattedSize}, Deployment Time: ${appRuntime.timestamp}`);

                // Rest of the code...
                try {
                    //const resp = await warCheckerData.insertAppsInfo(appRuntime.name, `${formattedSize}`, appRuntime.timestamp, currentTime.toLocaleString(), this.teamid, this.cluster, this.location);
                    const resp = await warCheckerData.insertAppsInfonew(appRuntime.name, this.teamid, this.cluster, this.location);
                    // Handle the response if needed
                } catch (err) {
                    console.error(`Failed to insert app info: ${err}`);
                }


                appList.push({
                    name: appRuntime.name,
                    size: formattedSize,
                    timestamp: appRuntime.timestamp,
                    lastUpdate: currentTime.toLocaleString()
                });
            }

            return appList;
        } catch (err) {
            console.error(`Failed to connect to WebLogic: ${err}`);
            return [];
        }
    }
    async getDeployedApplicationsoldess() {
        const restOptions = {
            uri: `${this.hostname}/management/weblogic/latest/domainRuntime/deploymentManager/appDeploymentRuntimes`,
            auth: {
                user: this.username,
                pass: this.password,
                sendImmediately: false
            },
            json: true
        };

        try {
            const appDeploymentRuntimes = await rp(restOptions);
            const appList = [];
            const currentTime = new Date();

            for (const appRuntime of appDeploymentRuntimes.items) {
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

                try {
                    const resp = await warCheckerData.insertAppsInfo(appRuntime.name, `${appSize} ${appSizeUnit}`, appRuntime.timestamp, currentTime.toLocaleString(), this.teamid, this.cluster, this.location);
                    // Handle the response if needed
                } catch (err) {
                    console.error(`Failed to insert app info: ${err}`);
                }

                appList.push({
                    name: appRuntime.name,
                    size: `${appSize} ${appSizeUnit}`,
                    timestamp: appRuntime.timestamp,
                    lastUpdate: currentTime.toLocaleString()
                });
            }

            return appList;
        } catch (err) {
            console.error(`Failed to connect to WebLogic: ${err}`);
            return [];
        }
    }
    async getDeployedApplications2() {
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
            const currentTime = new Date();
            serverRuntimes.items.forEach((serverRuntime) => {
                serverRuntime.applicationRuntimes.items.forEach(async(appRuntime) => {
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
                    let resp = await warCheckerData.insertAppsInfo(appRuntime.name, ` ${appSize} ${appSizeUnit}`, appRuntime.timestamp, currentTime.toLocaleString(), this.teamid, this.cluster, this.location)

                    appList.push({
                        name: appRuntime.name,
                        size: `${appSize} ${appSizeUnit}`,
                        timestamp: appRuntime.timestamp,
                        lastUpdate: currentTime.toLocaleString()
                    });
                });
            });
            return appList;
        } catch (err) {
            console.error(`Failed to connect to WebLogic: ${err}`);
            return [];
        }
    }
}

// const weblogic = new WebLogicAPI('remote-weblogic-server-hostname', 7001, 'weblogic', 'weblogic');
// weblogic.getDeployedApplications()
//     .then((appList) => {
//         console.log(appList);
//     })
//     .catch((err) => {
//         console.error(`Failed to get deployed applications: ${err}`);
//     });


module.exports = WebLogicAPI;