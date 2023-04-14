var express = require('express');
var cors = require('cors')
require("dotenv").config();
const cron = require('node-cron');
const FileMover = require('./filemover/newFiless')
const indexRoute = require('./router/index');
const moveFilesToFolders = require('./filemover/moveFilesToFolders')




var app = express();
app.use(express.json());
app.use(cors());


app.use(indexRoute)

const port = process.env.PORT || 3000;


app.listen(port, function () {
    console.log(`App running @ port: ${port}`);

    var task =cron.schedule(' 1 * * * * *', ()=>{
        console.log("Task has submited successfully")
        const folderPath = '/Users/mac/Desktop/untitled folder 2/Output';
       //  let fileMover = new FileMover(folderPath)
         //fileMover.divideFilesByFolders();
         moveFilesToFolders()
        console.log ( '[' + new Date().toISOString().substring(11,23) + '] -')

    });
}
)