var util = require('util'),
    lactate = require('lactate'),
    files = lactate.dir('public'),
    everyauth = require('everyauth'),
    sass = require('node-sass'),
    vendor_files = lactate.dir('vendor');

module.exports = function(app, express, db) {
    require('./models')(db);    
    require('./routes/auth');

    
    app.configure(function(){
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.methodOverride());
    });

    app.configure('development', function(){
        app.use(express.logger('dev'));

        files.disable('minify');
        files.disable('gzip');
        files.disable('watch files');
        files.set('max age', 1);
        files.disable('cache'); 

        vendor_files.disable('minify');
        vendor_files.disable('gzip');
    });

    app.configure('production', function(){
        
        files.enable('minify');
        files.enable('gzip');

        vendor_files.enable('minify');
        vendor_files.enable('gzip');
    });

    app.configure(function(){
        app.use(express.session({secret: "sian's blog roller"}));
        app.use(express.csrf());
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
            next();
        });
        
        app.use( function (req, res, next) {
            res.locals['user'] = req.user;
            next();
        });
        
    
        
        app.use(function(req, res, next) {
            console.log('body: ' + util.inspect(req.body));
            console.log('cookies: ' + util.inspect(req.cookies));
            console.log('env: ' + app.get('env'));
            console.log('session: ', req.session);        
            console.log('req.user: ', req.user);
            console.log('everyauth: ', res.locals.everyauth);

            res.locals['csrf_token'] = req.session._csrf;

            // res.locals.user = req.user ? req.user: undefined;
            next();
        });

        app.use(sass.middleware({
            src: __dirname + '/public',
            dest: __dirname + '/public',
            debug: true
        }));

        app.use(require('less-middleware')({ src: __dirname + '/public' }));
        app.use(vendor_files.toMiddleware());   
        app.use(files.toMiddleware());

    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });
};
