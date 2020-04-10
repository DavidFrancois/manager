const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

// Handle CORS
app.use(cors());
app.use(express.json());

module.exports = app;

routes.forEach(route => app.use(`/manager${route.path}`, route.router));