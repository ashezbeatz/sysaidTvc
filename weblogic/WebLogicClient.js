const request = require('request');

class WebLogicClient {
    constructor(weblogicUrl, username, password) {
        this.weblogicUrl = weblogicUrl;
        this.username = username;
        this.password = password;
    }

    async fetchDeployedApplications() {
        const mbeanUrl = `${this.weblogicUrl}/management/wls/latest/domainRuntime`;
        const auth = {
            user: this.username,
            pass: this.password,
            sendImmediately: true
        };

        const mbeanQuery = 'com.bea:Name=*,Type=AppDeployment';

        const requestBody = {
            mbean: mbeanQuery,
            targetType: 'com.bea.core.application.ApplicationMBean',
            operation: 'getDeploymentAttributes',
            arguments: ['ApplicationName', 'State', 'ModuleType', 'BytesTotal', 'DeploymentTime']
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

                if (response.statusCode === 200 && body && body.result && body.result.length > 0) {
                    const deployments = body.result;
                    const applicationList = deployments.map((deployment) => {
                        const name = deployment.ApplicationName;
                        const state = deployment.State;
                        const deploymentSize = deployment.BytesTotal;
                        const deploymentTime = deployment.DeploymentTime;
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