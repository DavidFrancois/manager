'use strict';

const App = require('./app');
const http = require('http').Server(App);

const port = process.env.PORT || 8080;
const HOST = '0.0.0.0';

http.listen(port, HOST, () => console.log(`Server listening on http://${HOST}/${port}`));