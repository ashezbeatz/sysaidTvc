var express = require('express');
var cors = require('cors')
require("dotenv").config();

const indexRoute = require('./router/index');




var app = express();
app.use(express.json());
app.use(cors());


app.use(indexRoute)

const port = process.env.PORT || 3000;


app.listen(port, function () {
    console.log(`App running @ port: ${port}`);
}
)