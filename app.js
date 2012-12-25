/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    mongoose = require('mongoose');

// use default connection
mongoose.connect('127.0.0.1', 'foodsplay');

mongoose.connection.once('open', function() {
    console.log('connect to database');

    var app = express();
    require('./config')(app, express);
    routes.setup(app);

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
});
