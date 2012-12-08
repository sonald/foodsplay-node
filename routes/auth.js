var everyauth = require('everyauth'),
    models = require('../models'),
    bcrypt = require('bcrypt');

function encryptSync(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
}

everyauth.everymodule
    .userPkey('_id')
    .findUserById(function (uid, callback) {
        console.log('findUserById: _id = ', uid);
        models.UserModel
            .findOne({_id: uid})
            .select('username password email _id')
            .exec(function(err, user) {
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

everyauth.everymodule
    .performRedirect( function (res, location) {
        console.log('redirect');
        res.redirect(location, 303);
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
        models.UserModel
            .findOne({username: login})
            .select('username password email _id')
            .exec(function(err, user) {
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
        function isEmpty(val) {
            return String(val).trim().length == 0;
        }

        var promise = this.Promise();
        
        var errors = [];
        if (isEmpty(newUserAttrs.email)) {
            errors.push('email is needed');
        }

        if (isEmpty(newUserAttrs.username)) {
            errors.push('username is needed');
        }

        models.UserModel.find()
            .or([{username: newUserAttrs.username} , {email: newUserAttrs.email}])
            .exec(function(err, result) {
                if (err) {
                    errors.push(err.message);
                }

                if (result.length > 0) {
                    errors.push('user exists or email is already used');
                }
                
                promise.fulfill(errors);
            });
        
        return promise;
    })
    .registerUser( function (newUserAttrs) {
        console.log('registerUser: ', newUserAttrs);

        var promise = this.Promise();
        newUserAttrs.type = 1;
        newUserAttrs.password = encryptSync(newUserAttrs.password);
        var newUser = new models.UserModel(newUserAttrs);
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

