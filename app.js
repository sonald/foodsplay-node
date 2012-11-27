/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    mongoose = require('mongoose');

var db = mongoose.createConnection('127.0.0.1', 'foodsplay');
var app = express();

var config = require('./config')(app, express, db);
app.set('app config', config);

routes.setup(app);

db.once('open', function() {
    console.log('connect to database');

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
});

