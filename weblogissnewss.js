const request = require('request');

function getDeploymentInfo(baseURL, applicationName) {
    const endpoint = `${baseURL}/management/weblogic/latest/domainRuntime/deploymentManager/appDeployments/${applicationName}`;

    const options = {
        url: endpoint,
        auth: {
            user: 'test',
            pass: 'Test2023'
        }
    };

    return new Promise((resolve, reject) => {
        request.get(options, (error, response, body) => {
            if (error) {
                reject(`Error occurred while retrieving deployment information: ${error}`);
            } else if (response.statusCode === 200) {
                const deploymentInfo = JSON.parse(body);
                resolve(deploymentInfo);
            } else {
                reject(`Failed to retrieve deployment information. Status code: ${response.statusCode}`);
            }
        });
    });
}

async function main() {
    console.log("starting..........")
    const baseURL = 'http://10.8.179.35:7001'; // Replace with the base URL of your WebLogic Server
    const applicationName = 'pilotmobilemoneyportal'; // Replace with the name of your deployed application

    try {
        const deploymentInfo = await getDeploymentInfo(baseURL, applicationName);

        console.log('Deployment Information:');
        console.log('Path:', deploymentInfo.absoluteSourcePath);
        console.log('Size:', deploymentInfo.size, 'bytes');
        console.log('Checksum:', deploymentInfo.hash);
        console.log('Created:', deploymentInfo.created);
    } catch (error) {
        console.error('Failed to retrieve deployment information:', error);
    }
    console.log("ending..........")
}

main();