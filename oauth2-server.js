var OAuth2Provider = require('oauth2-provider').OAuth2Provider,
    models = require('./models'),
    bcrypt = require('bcrypt');

function ClientManager() {}
ClientManager.prototype = {
    // create new client for user
    assignClientFor: function(userid) {
    },

    // save client authorization token in db
    saveClient: function(cli_id, token) {
    },

    delClient: function(cli_id) {
    },

    saveToken: function(user_id, client_id, token, cb) {
        cb = cb || function() {};

        models.ClientModel
            .findOne({clientId: client_id})
            .exec(function(err, cli) {
                if (err || !cli) {
                    return cb(new Error('can not find client'));
                }

                cli.accessToken = String(token.access_token);
                cli.save(function(err) {
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, cli);
                });
            });
    },

    findUser: function(userid, cb) {
        var self = this;
        models.UserModel
            .findOne({_id: userid}).select('username kind email _id')
            .exec(function(err, user) {
                cb(err, user);
            });
    },

    authenticateClient: function(client_id, client_secret, username, password, cb) {
        var self = this;
        models.ClientModel
            .findOne({clientId: client_id, clientSecret: client_secret})
            .populate('user')
            .exec(function(err, cli) {
                if (err || !cli || !cli.user) {
                    return cb(err || new Error('client mismatch'));
                }

                if (!bcrypt.compareSync(password, cli.user.password)) {
                    return cb(new Error('incorrect password'));
                }

                return cb(null, cli.user);
            });
    }

};

ClientManager.prototype.constructor = ClientManager;

var manager = module.exports.manager = new ClientManager;


var myOAP = module.exports.oauthServer = new OAuth2Provider({
    crypt_key: 'foodsplay secret', sign_key: 'foodsplay signing secret'
});

// before showing authorization page, make sure the user is logged in
myOAP.on('enforce_login', function(req, res, authorize_url, next) {
    console.log('--- enforce_login: ');
    if(req.user) {
        next(req.user._id);
    } else {
        res.writeHead(303, {
            Location: '/users/signin?next=' + encodeURIComponent(authorize_url)
        });
        res.end();
    }
});

// render the authorize form with the submission URL
// use two submit buttons named "allow" and "deny" for the user's choice
myOAP.on('authorize_form', function(req, res, client_id, authorize_url) {
    res.end('<html>this app wants to access your account... <form method="post" action="' + authorize_url + '"><button name="allow">Allow</button><button name="deny">Deny</button></form>');
});

// save the generated grant code for the current user
myOAP.on('save_grant', function(req, client_id, code, next) {
    if(!(req.user._id in manager.grants))
        manager.grants[req.user._id] = {};

    manager.grants[req.user._id][client_id] = code;
    next();
});

// remove the grant when the access token has been sent
myOAP.on('remove_grant', function(user_id, client_id, code) {
    if(manager.grants[user_id] && manager.grants[user_id][client_id])
        delete manager.grants[user_id][client_id];
});

// find the user for a particular grant
myOAP.on('lookup_grant', function(client_id, client_secret, code, next) {
    // verify that client id/secret pair are valid
    if(client_id in manager.clients && manager.clients[client_id] == client_secret) {
        for(var userid in manager.grants) {
            var clients = manager.grants[userid];

            if(clients[client_id] && clients[client_id] == code)
                return next(null, userid);
        }
    }

    next(new Error('no such grant found'));
});

// embed an opaque value in the generated access token
myOAP.on('create_access_token', function(user_id, client_id, next) {
    var data = 'blah'; // can be any data type or null

    next(data);
});

myOAP.on('save_access_token', function(user_id, client_id, token) {
    console.log('saving access token %s for user_id=%s client_id=%s',
                JSON.stringify(token), user_id, client_id);
    manager.saveToken(user_id, client_id, token);
});

myOAP.on('access_token', function(req, token, next) {
    var TOKEN_TTL = 24 * 60 * 60 * 1000; // 1 day

    if(token.grant_date.getTime() + TOKEN_TTL > Date.now()) {
        manager.findUser(token.user_id, function(err, dbuser) {
            console.log('regsiter client\'s user in session');
            // compatible with everyauth
            req.session.auth = req.session.auth || {
                userId: dbuser._id,
                loggedIn: true
            };
            // req.user = dbuser;
            next();
        });

        // req.extra_data = token.extra_data;

    } else {
        console.warn('access token for user %s has expired', token.user_id);
    }
});

myOAP.on('client_auth', function(client_id, client_secret, username, password, next) {
    manager.authenticateClient(
        client_id, client_secret, username, password,
        function(err, user) {
            if (err) {
                console.log(err.message);
                return next(new Error('client authentication denied'));
            }

            return next(err, user._id);
        });
});
