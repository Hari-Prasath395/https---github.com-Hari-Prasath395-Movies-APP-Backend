const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const moviesController = require('./controllers/movieController');
const theatersController = require('./controllers/theatersController');
const bookingsController = require('./controllers/bookingsController');

const appServer = express();




appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({extended:true}));

appServer.use('/api/users',userController);
appServer.use('/api/movies',moviesController);
appServer.use('/api/theater',theatersController);
appServer.use('/api/bookings',bookingsController);







module.exports = appServer