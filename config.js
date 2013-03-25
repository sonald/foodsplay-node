var util = require('util'),
    lactate = require('lactate'),
    files = lactate.dir('public'),
    everyauth = require('everyauth'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongodb'),
    sass = require('node-sass'),
    vendor_files = lactate.dir('vendor');

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
            cookie: {maxAge: 60000 * 20},
            store: new mongoStore({db: mongoose.connection.db})
        }));
        //FIXME: disable temperarily for wuhao
        // app.use(express.csrf());
        app.use(everyauth.middleware(app));

        app.use( function (req, res, next) {
            var sess = req.session
            , auth = sess.auth
            , ea = { loggedIn: !!(auth && auth.loggedIn) };

            // Copy the session.auth properties over
            for (var k in auth) {
                ea[k] = auth[k];
            }

            if (everyauth.enabled.password) {
                // Add in access to loginFormFieldName() + passwordFormFieldName()
                ea.password || (ea.password = {});
                ea.password.loginFormFieldName = everyauth.password.loginFormFieldName();
                ea.password.passwordFormFieldName = everyauth.password.passwordFormFieldName();
            }
            ea.user = req.user;

            res.locals.everyauth = ea;
            res.locals['user'] = req.user;
            res.locals['csrf_token'] = req.session._csrf || "fake_csrf_token";


            next();
        });

        app.use(sass.middleware({
            src: __dirname + '/public',
            dest: __dirname + '/public',
            debug: true
        }));

        // app.use(require('less-middleware')({ src: __dirname + '/public' }));
        app.use(vendor_files.toMiddleware());

        files.notFound('public/404.html');
        app.use(files.toMiddleware());

    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });
};
