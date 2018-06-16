// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB Setup
mongoose.connect('mongodb://ninjaba:ninjaba2018@ds153460.mlab.com:53460/ninjaba-webapp');

// App Setup
app.use(morgan('combined')); // Middleware in express
app.use(cors());
app.use(bodyParser.json({ type: '*/*'})); // Middleware in express
router(app);


// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port)
