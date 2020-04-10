var express = require('express');
var router = express.Router();
var controllers = require('./../controllers');

router.route('/')
    .get(controllers.keys.get)
    .post(controllers.keys.post);

module.exports = { path: '/keys', router: router };