// GET     /restaurants              ->  index
// GET     /restaurants/new          ->  new
// POST    /restaurants              ->  create
// GET     /restaurants/:restaurant       ->  show
// GET     /restaurants/:restaurant/edit  ->  edit
// PUT     /restaurants/:restaurant       ->  update
// DELETE  /restaurants/:restaurant       ->  destroy

var models = require('../models'),
    util = require('util');

module.exports = {
    index: function(req, res) {
        if (req.user.kind != models.USER_ADMIN) {
            return res.send(403);
        }

        models.RestaurantModel
            .find()
            .select("_id name _user foods.id")
            .exec(function(err, restaurants) {
                if (err) {
                    return res.send(406);
                }
                res.send(JSON.stringify(restaurants));
            });
    },

    create: function(req, res) {
        var b = req.body;

        var newRestaurant = new models.RestaurantModel({
            name: {
                zh: b['name.zh'],
                en: b['name.en']
            },

            description: {
                zh: b['description.zh'],
                en: b['description.en']
            },

            _user: req.user._id
        });

        newRestaurant.save(function(err) {
            if (err) {
                console.log(err);
            }
            console.log(newRestaurant);
            res.redirect('/#/restaurants/' + newRestaurant._id);
        });
    },

    show: function(req, res) {
        if (req.user.kind == models.USER_NORMAL) {
            return res.send(403);
        }

        models.RestaurantModel
            .findOne({_id: req.params.restaurant, _user: req.user._id})
            .select("_id _user name description foods._id orders._id")
            .exec(function(err, restaurant) {
                if (err) {
                    res.send(406);
                } else if (restaurant) {
                    res.send(JSON.stringify(restaurant));
                } else {
                    res.send(404);
                }
            });
    },

    edit: function(req, res) {
        res.send(404);
    },

    update: function(req, res) {
        if (req.user.kind == models.USER_NORMAL) {
            return res.send(403);
        }

        var b = req.body;
        var schema = models.RestaurantModel.schema;
        var keys = {};
        Object.keys(b).map(function(path) {
            if (!!schema.path(path) && path != '_id') {
                keys[path] = b[path];
            }
        });
        console.log('b: ', b, 'put: ', keys);

        models.RestaurantModel
            .update({_id: b['_id']}, keys, function(err, numAffected) {
                if (err) {
                    return res.send(406);
                }

                console.log('put restaurant, numAffected: ', numAffected);
                if (numAffected == 1) {
                    res.redirect('/#/restaurants/' + b['_id']);
                } else {
                    res.send(500);
                }
            });
    },

    destroy: function(req, res) {
        res.send('destroy restaurant ' + req.restaurant.title);
    }
};
