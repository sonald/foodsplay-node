var util = require('util'),
    lactate = require('lactate'),
    files = lactate.dir('public'),
    everyauth = require('everyauth'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    sass = require('node-sass'),
    vendor_files = lactate.dir('vendor'),
    oauth2 = require('./oauth2-server').oauthServer;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

module.exports = function(app, express) {

    require('./routes/auth');

    app.configure(function(){
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.query());
        app.use(express.methodOverride());
        app.use(allowCrossDomain);
    });

    app.configure('development', function() {
        app.use(express.logger('dev'));

        files.disable('minify');
        files.disable('gzip');
        files.disable('watch files');
        files.set('max age', 1);
        files.disable('cache');

        vendor_files.disable('minify');
        vendor_files.disable('gzip');
    });

    app.configure('production', function() {
        files.enable('minify');
        files.enable('gzip');

        // vendor_files.enable('minify');
        vendor_files.enable('gzip');
    });

    app.configure(function() {
        app.use(express.session({
            secret: "sian's blog roller",
            cookie: {maxAge: 60000 * 60 * 24 * 365},
            store: new mongoStore({db: mongoose.connection.db})
        }));

        app.use(oauth2.oauth());
        app.use(oauth2.login());
        //FIXME: disable temperarily for client
        // app.use(express.csrf());
        app.use(everyauth.middleware(app));
        app.use( function (req, res, next) {
            res.locals['csrf_token'] = req.session._csrf || "fake_csrf_token";
            next();
        });

        app.use(app.router);

        app.use(sass.middleware({
            src: __dirname + '/public',
            dest: __dirname + '/public',
            debug: true
        }));

		app.use(lactate.static(__dirname+"/public"));
		app.use(lactate.static(__dirname+"/vendor"));
		
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });
};
