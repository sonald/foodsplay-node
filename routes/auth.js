var everyauth = require('everyauth'),
    models = require('../models'),
    bcrypt = require('bcrypt'),
    util = require('util');

function encryptSync(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
}

everyauth.everymodule
    .userPkey('_id')
    .findUserById(function (req, uid, callback) {
        console.log('findUserById: _id = ', uid);

        models.UserModel
            .findOne({_id: uid}).select('username kind email _id')
            .exec(function(err, user) {
                console.log('find user: ', user);
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

everyauth.password
    .respondToLoginSucceed( function (res, user, data) {
        console.log('respondToLoginSucceed: ', user);

        if (user) {
            if (res.req.body['device'] == 1) {
                res.send({
                    ipad: true,
                    user: user
                });

            } else {
                this.redirect(res, res.req.body.next || "/");
            }
            this.redirect(res, "/");
        }
    })
    .respondToLoginFail( function (req, res, errors, login) {
        console.log('respondToLoginFail: ', req.body, errors);
        if (!errors || !errors.length) {
            return;
        }

        if (req.body['device'] == 1) {
            res.send({
                ipad: true,
                login: false,
                errors: errors
            });

        } else {
            //HACK: inspired from everyauth passwd module
            var locals = {};
            locals.errors = errors;
            locals[this.loginKey()] = login;
            var extraLocals = this['_loginLocals'];
            if (typeof extraLocals === 'function') {
                extraLocals = extraLocals(req, res);
            }
            console.log('extraLocals: ', extraLocals);
            for (var i in extraLocals) {
                locals[i] = extraLocals[i];
            }

            res.render("user/signin", locals);
        }
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
            csrf_token: req.session._csrf,
            next: req.query.next ? req.query.next: undefined
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
            .select('username password kind _id')
            .exec(function(err, user) {
                if (err) {
                    return promise.fulfill([err]);
                }

                if (!user) {
                    return promise.fulfill(["user not found"]);
                }

                console.log('find user: ', user);

                if (!bcrypt.compareSync(password, user.password)) {
                    return promise.fulfill(['incorrect password']);

                }

                console.log('authenticate correctly');
                user = user.toObject({minimize: false});
                delete user.password;

                if (user.kind === models.USER_RESTAURANT) {
                    models.RestaurantModel
                        .findOne({_user: user._id}).select('_id')
                        .exec(function(err1, restaurant) {
                            if (restaurant) {
                                console.log('find restaurant: ', restaurant._id);
                                user.restaurant = restaurant._id;
                            }

                            return promise.fulfill(user);
                        });

                } else {
                    return promise.fulfill(user);
                }
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
    .extractExtraRegistrationParams(function(req) {
        console.log('loginkey: ', this.loginKey());
        return {
            email: req.body.email,
            username: req.body.username,
            kind: req.body.kind
        };
    })
    .validateRegistration(function(newUserAttrs) {
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
