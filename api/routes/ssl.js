var express = require('express');
var router = express.Router();
var controllers = require('./../controllers');

router.route('/')
    .get(controllers.ssl.get);

module.exports = { path: '/ssl', router: router };