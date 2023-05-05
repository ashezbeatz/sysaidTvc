const Wljmx = require('wljmx');
const mysql = require('mysql2/promise');
require("dotenv").config();



class WebLogicAppInfo {
    constructor(adminServerUrl, username, password, dbConfig, teamid, catergory) {
        this.adminServerUrl = adminServerUrl;
        this.username = username;
        this.password = password;
        this.dbConfig = dbConfig;
        this.jmx = new Wljmx();
        this.teamid = teamid;
        this.catergory = catergory;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.jmx.connect(this.adminServerUrl, this.username, this.password, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            this.jmx.disconnect((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async getAppInfo(appName) {
        const appMbean = this.jmx.getMBean(`com.bea:Name=${appName},Type=AppDeployment`);
        const appNamePromise = appMbean.invoke('getApplicationName');
        const deploymentTimePromise = appMbean.getAttribute('DeploymentTime');
        const updateTimePromise = appMbean.getAttribute('UpdateTime');
        const sizePromise = appMbean.getAttribute('Size');
        const [appNameResult, deploymentTimeResult, updateTimeResult, sizeResult] = await Promise.all([
            appNamePromise,
            deploymentTimePromise,
            updateTimePromise,
            sizePromise,
        ]);
        return {
            name: appNameResult,
            deploymentTime: new Date(deploymentTimeResult),
            updateTime: new Date(updateTimeResult),
            size: sizeResult,
        };
    }

    async insertAppInfo(info) {
        const connection = await mysql.createConnection(this.dbConfig);
        const [rows, fields] = await connection.execute('INSERT INTO app_info (name, deployment_time, update_time, size) VALUES (?, ?, ?, ?)', [
            info.name,
            info.deploymentTime,
            info.updateTime,
            info.size,
        ]);
        await connection.release();
        return rows.insertId;
    }
}

module.exports = WebLogicAppInfo