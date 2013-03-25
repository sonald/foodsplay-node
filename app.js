/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    mongoose = require('mongoose');

// use default connection
if (process.env.FOODSPLAY_DB) {
    //mongoose.connect('127.0.0.1', 'foodsplay');
    mongoose.connect('mongodb://127.0.0.1/foodsplay');
} else {
    mongoose.connect('mongodb://nodejitsu:715a0b47f2b374f36b3ba71983388bac@alex.mongohq.com:10003/nodejitsudb1701304151');
}

mongoose.connection.once('open', function() {
    console.log('connect to database');

    var app = express();
    require('./config')(app, express);
    routes.setup(app);

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
});
