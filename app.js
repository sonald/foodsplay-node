/**
 * Module dependencies.
 */

var util = require('util'),
    lactate = require('lactate'),
    files = lactate.dir('public'),
    vendor_files = lactate.dir('vendor'),
    express = require('express'),
    routes = require('./routes'),
    sass = require('node-sass'),
    http = require('http'),
    everyauth = require('everyauth'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    path = require('path');

var db = mongoose.createConnection('127.0.0.1', 'foodsplay');
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    type: Number // normal user or amdin or restaurant
});
var UserModel = db.model('User', UserSchema);

function encryptSync(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
}

var app = express();

var usersByLogin = {
    "sian": { username:"sian", password: "abc123", id: "2" }
};

everyauth.everymodule
    .userPkey('_id')
    .findUserById(function (uid, callback) {
        console.log('findUserById: _id = ', uid);
        UserModel.findOne({_id: uid}, 'username password email uid', function(err, user) {
            callback(null, user);
        });
    });
    
everyauth.everymodule.
    logoutPath('/users/logout')
    .logoutRedirectPath('/users/signin');

everyauth.everymodule.handleLogout( function (req, res) {
    req.logout(); // The logout method is added for you by everyauth, too
    this.redirect(res, this.logoutRedirectPath());
});

everyauth.debug = true;
everyauth
    .password
    .loginWith('login')
    .loginFormFieldName('username') 
    .getLoginPath('/users/signin')
    .postLoginPath('/users/signin')
    .loginView('user/signin.jade')
    .loginLocals(function(req, res) {
        return {
            title: "Sign in Please",
            csrf_token: req.session._csrf
        };
    })
    .authenticate( function (login, password) {
        console.log('authenticate: %s - %s', login, password);
        var errors = [];
        if (!login) errors.push('Missing login.');
        if (!password) errors.push('Missing password.');
        if (errors.length) return errors;
        
        var promise = this.Promise();
        UserModel.findOne({username: login}, 'username password email _id', function(err, user) {
            if (err) {
                return promise.fulfill([err]);
            }
            
            console.log('find user: ', user);
            
            if (!bcrypt.compareSync(password, user.password)) {
                return promise.fulfill(['incorrect password']);
            } 

            console.log('authenticate correctly');
            return promise.fulfill(user);
        });
        return promise;
    })
    .getRegisterPath('/users/signup')
    .postRegisterPath('/users/signup')
    .registerView('user/signup.jade')
    .registerLocals( function (req, res) {
        return {
            title: 'register here',
            csrf_token: req.session._csrf
        };
    })
    .extractExtraRegistrationParams( function (req) {
        console.log('loginkey: ', this.loginKey());
        return {
            email: req.body.email,
            username: req.body.username
        };
    })
    .validateRegistration( function (newUserAttrs) {
        console.log('validateRegistration: ', newUserAttrs);
        
        // var login = newUserAttrs.login;
        // if (usersByLogin[login]) errors.push('Login already taken');
        return [];
    })
    .registerUser( function (newUserAttrs) {
        console.log('registerUser: ', newUserAttrs);

        var promise = this.Promise();
        newUserAttrs.type = 1;
        newUserAttrs.password = encryptSync(newUserAttrs.password);
        var newUser = new UserModel(newUserAttrs);
        newUser.save(function(err) {
            if (err) {
                promise.fulfill([err]);
            } else {
                console.log('register saved');
                newUserAttrs._id = newUser._id;
                promise.fulfill(newUserAttrs);
            }
        });
        
        return promise;
    })
    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');

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
    
    app.use(function(req, res, next) {
        console.log('body: ' + util.inspect(req.body));
        console.log('cookies: ' + util.inspect(req.cookies));
        console.log('env: ' + app.get('env'));
        console.log('session: ', req.session);        
        console.log('req.user: ', req.user);
        
        console.log('everyauth: ', res.locals.everyauth);
        console.log('locals: ', res.locals());

        res.locals.user = req.user ? req.user: undefined;
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

routes.setup(app);

db.once('open', function() {
    console.log('connect to database');

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
});

