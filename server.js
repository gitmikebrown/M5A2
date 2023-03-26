//set environment variables
const dotenv = require('dotenv'); //must be the first 2 lines of code
dotenv.config({path: './config.env'});

//Template for Node.js Express Server
const express = require('express');

//Create express app
const app = express();

//Body-parser is a middleware that parses incoming requests with JSON payloads and is based on body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//Path module provides utilities for working with file and directory paths
const path = require('path');

//debugging and logging
const morgan = require('morgan-body');

//middleware
//create a write stream (in append mode)
var rfs = require('rotating-file-stream'); // version 2.x

//serve static files
//create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', //rotate daily
    path: path.join(__dirname, 'log'), //log directory will log all data here
})

//setup the logger
morgan(app, {
    stream: accessLogStream,
    noColors: true,
    logReqUserAgent: true,
    logRequestBody: true,
    logResponseBody: true,
    logReqCookies: true,
    logReqSignedCookies: true
});

//__dirname is the directory name of the current module
app.use(express.static(path.join(__dirname, 'public')));

//set the view engine to ejs
app.set('view engine', 'ejs');

//set the views directory
app.set('views', 'views');

//routes defined in routes folder
const authenticationRoute = require('./routes/authenticationRoute');
app.use('/api', authenticationRoute);

//404 page Error
app.use((err, req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

//Connecting to the Database
const mongoose = require('mongoose');


// asynchronous connection
const MONGO_DATA_BASE = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(MONGO_DATA_BASE, {useNewUrlParser: true})
    .then(() => console.log('DB connection successfull\n**********************************'))
    .catch((err) => console.error(err));

// start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});