// Example usage:
const appInfo = new WebLogicAppInfo('t3://localhost:7001', 'weblogic', 'weblogic123', {
    host: 'localhost',
    user: 'dbuser',
    password: 'dbpassword',
    database: 'testdb',
});
(async() => {
    try {
        await appInfo.connect();
        const info = await appInfo.getAppInfo('exampleApp');
        console.log('Application Info:', info);
        const insertId = await appInfo.insertAppInfo(info);
        console.log('Inserted App Info with ID:', insertId);
        await appInfo.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
})();