const express = require('express')
const Route = express.Router();

const IndexController = require('../controllers/indexController');


Route.get('/', IndexController.index)
Route.get('/getCurData', IndexController.curData)
Route.get('/getOtherStatus', IndexController.otherStatus)
Route.get('/Leaderboard', IndexController.Leaderboard)

Route.get('/getStatus', IndexController.getStatus)




module.exports = Route;