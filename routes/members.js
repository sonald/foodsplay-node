var util = require('util'),
    models = require('../models');

//TODO: populate history
exports.index = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findOne({_id: req.params.restaurant})
        .select("members")
        .exec(function(err, restaurant) {
            if (err) {
                res.send(406);
            } else {
                res.send(JSON.stringify(restaurant.members));
            }
        });
};

exports.create = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    var b = req.body;
    var newMember = {
        name: b['name'],
        sex: b['sex'],
        birth: b['birth'],
        icnum: b['icnum'],
        address: b['address'],
        phone: b['phone'],
        mobile: b['mobile'],
        email: b['email'],
        cardid: b['cardid'],
        kind: b['kind'],
        credits: 0,
        history: []
    };

    models.RestaurantModel.update(
        {_id: req.params.restaurant},
        {$push: { members: newMember }},
        function(err, numAffected) {
            if (err) {
                console.log(err);
                return res.send(403);
            }

            res.redirect('#/restaurants/' + b.restaurantid);
        });
};

//TODO: populate history
exports.show = function(req, res){
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findOne({_id: req.params.restaurant})
        .select("members")
        .exec(function(err, restaurant) {
            if (err) {
                res.send(406);
            } else {
                res.send(JSON.stringify(restaurant.members.id(req.params.member)));
            }
        });
};

exports.update = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    var b = req.body;

    models.RestaurantModel
        .findById(req.params.restaurant, function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            var member = restaurant.members.id(req.params.member);
            Object.keys(b).map(function(path) {
                if (path.indexOf('.') > -1) {
                    eval('member.' + path + '=' + JSON.stringify(b[path]));
                } else if (path in member) {
                    member[path] = b[path];
                }
            });

            console.log(member);
            restaurant.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(403);
                }
                return res.send(200);
            });
        });
};

exports.destroy = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findById(req.params.restaurant, function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            restaurant.members.id(req.params.member).remove();
            restaurant.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(403);
                }
                return res.send(200);
            });
        });
};
