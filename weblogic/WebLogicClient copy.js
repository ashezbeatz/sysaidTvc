const request = require('request');

class WebLogicClient {
    constructor(weblogicUrl, username, password) {
        this.weblogicUrl = weblogicUrl;
        this.username = username;
        this.password = password;
    }

    async fetchDeployedApplications() {
        const mbeanUrl = `${this.weblogicUrl}/management/weblogic/latest/edit/JMXQuery`;
        const auth = {
            user: this.username,
            pass: this.password,
            sendImmediately: true
        };

        const mbeanQuery = `
      select
        DeploymentName,
        State,
        BytesTotal,
        DeploymentTime
      from
        weblogic.management.runtime.DeploymentMBean`;

        const requestBody = {
            "mbean": mbeanQuery,
            "mbeanType": "weblogic.management.runtime.DeploymentMBean"
        };

        const options = {
            url: mbeanUrl,
            auth,
            json: requestBody
        };

        return new Promise((resolve, reject) => {
            request.post(options, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (response.statusCode === 200 && body && body.children) {
                    const deployments = body.children;
                    const applicationList = deployments.map((deployment) => {
                        const name = deployment.attributes.DeploymentName;
                        const state = deployment.attributes.State;
                        const deploymentSize = deployment.attributes.BytesTotal;
                        const deploymentTime = deployment.attributes.DeploymentTime;

                        return {
                            name,
                            state,
                            size: deploymentSize,
                            deploymentTime
                        };
                    });

                    resolve(applicationList);
                } else {
                    reject(new Error('Failed to retrieve deployed applications.'));
                }
            });
        });
    }
}

module.exports = WebLogicClient;