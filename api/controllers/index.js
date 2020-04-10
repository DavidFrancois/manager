const controllers = {};

[
    'keys',
    'dbsaves',
    'ssl'
].forEach(f => controllers[f] = require('./' + f));

module.exports = controllers;