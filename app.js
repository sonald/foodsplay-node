/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    mongoose = require('mongoose');

// use default connection
var localmode = process.env.USER == 'sonald';


mongoose.connection.once('open', function() {
    console.log('connected to database');

    var app = express();
    require('./config')(app, express);
    routes.setup(app);

    http.createServer(app).listen(app.get('port'), function(){
        console.log("http server listening on port " + app.get('port'));
    });
});

if (localmode) {
    console.log('connecting local mongodb');
    mongoose.connect('mongodb://127.0.0.1/foodsplay');
} else {
    var db_url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL
		|| 'mongodb://nodejitsu:24ff315588c0c41ca75fd3a5cc0bbd1a@dharma.mongohq.com:10061/nodejitsudb7191831402';
    console.log('connecting ', db_url);
    mongoose.connect(db_url);
}