var models = require('../models'),
    util = require('util'),
    crypto = require('crypto');

exports.index = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    var filter_op = (function() {
        if (req.user.kind == models.USER_ADMIN) {
            return function() { return true; };
        } else {
            return function(cli) {
                return cli.user == String(req.user._id);
            };
        }
    }());

    console.log(filter_op.toString());
    models.ClientModel
        .find({user: req.user._id})
        .exec(function(err, clients) {
            if (err) {
                return res.send(406);
            }
            return res.send(JSON.stringify(clients.filter(filter_op)));
        });
};

// now only restaurant user can create clients for restaurant
exports.create = function(req, res) {
    if (req.user.kind != models.USER_RESTAURANT) {
        return res.send(403);
    }

    function checkValid() {
        var cli_id = crypto.randomBytes(16).toString('hex');
        console.log('generate and check client id: ', cli_id);
        models.ClientModel
            .findOne({clientId: cli_id})
            .exec(function(err, cli) {
                if (cli) {
                    return setTimeout(checkValid, 0);
                }

                var client = new models.ClientModel({
                    clientId: cli_id,
                    clientSecret: crypto.randomBytes(32).toString('hex'),
                    user: req.user._id,
                    appUrl: req.body.appUrl || '',
                    appName: req.body.appName || ''
                });
                client.save(function(err) {
                    console.log(req.format);
                    switch (req.format) {
                    case 'json':
                        return res.send({
                            client_id: cli_id, client_secret: client.clientSecret
                        });

                    default:
                        res.redirect('#/restaurants/' + req.params.restaurant + '/clients');
                    }
                });
            });
    }
    checkValid();
};

exports.update = function(req, res) {
    res.send(501);
};

exports.destroy = function(req, res) {
    res.send(501);
}
