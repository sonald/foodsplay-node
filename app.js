/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    mongoose = require('mongoose');

// var db = mongoose.createConnection('127.0.0.1', 'foodsplay');
// use default connection
mongoose.connect('127.0.0.1', 'foodsplay');
var app = express();

mongoose.connection.once('open', function() {
    console.log('connect to database');

    require('./config')(app, express);
    routes.setup(app);

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
});
