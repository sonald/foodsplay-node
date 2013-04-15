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
if (localmode) {
    console.log('connect local mongodb');
    mongoose.connect('mongodb://127.0.0.1/foodsplay');
} else {
    mongoose.connect('mongodb://nodejitsu:715a0b47f2b374f36b3ba71983388bac@alex.mongohq.com:10003/nodejitsudb1701304151');
}

mongoose.connection.once('open', function() {
    console.log('connect to database');

    var app = express();
    require('./config')(app, express);
    routes.setup(app);

    if (localmode) {
        // this self-signed pem now
        var https_opts = {
            key: fs.readFileSync('foodsplay.key'),
            cert: fs.readFileSync('foodsplay-ca.pem')
        };

        https.createServer(https_opts, app).listen(app.get('port'), function(){
            console.log("https server listening on port " + app.get('port'));
        });


    } else {
        http.createServer(app).listen(app.get('port'), function(){
            console.log("http server listening on port " + app.get('port'));
        });
    }

});
