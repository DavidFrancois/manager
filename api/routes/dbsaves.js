var express = require('express');
var router = express.Router();
var controllers = require('./../controllers');

router.route('/')
    .get(controllers.dbsaves.get)
    .put(controllers.dbsaves.put);

module.exports = { path: '/dbsaves', router: router };