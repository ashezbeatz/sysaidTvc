const express = require('express')
const Route = express.Router();

const IndexController = require('../controllers/indexController');


Route.get('/', IndexController.index)




module.exports = Route;