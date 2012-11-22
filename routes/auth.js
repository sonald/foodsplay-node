var everyauth = require('everyauth'),
    bcrypt = require('bcrypt');

function encryptSync(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
}

module.exports = (function(models) {
    everyauth.everymodule
        .userPkey('_id')
        .findUserById(function (uid, callback) {
            console.log('findUserById: _id = ', uid);
            models.UserModel.findOne({_id: uid}, 'username password email uid', function(err, user) {
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
            models.UserModel.findOne({username: login}, 'username password email _id', function(err, user) {
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

    return everyauth;

});
