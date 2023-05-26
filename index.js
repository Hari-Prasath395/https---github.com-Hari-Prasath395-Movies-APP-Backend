const express = require('express');
const nodeServer = express();
const app = require('./app');
const cors = require('cors');
const env = require('dotenv').config();
const connection =require('./dbconfig');
connection();
// Use the cors middleware
nodeServer.use(cors());

// Use the routes defined in the app
nodeServer.use('/', app);

const port = process.env.PORT || 8000;
nodeServer.listen(port, () => {
  console.log('Server Started');
});
