// GET     /restaurants              ->  index
// GET     /restaurants/new          ->  new
// POST    /restaurants              ->  create
// GET     /restaurants/:restaurant       ->  show
// GET     /restaurants/:restaurant/edit  ->  edit
// PUT     /restaurants/:restaurant       ->  update
// DELETE  /restaurants/:restaurant       ->  destroy

var models = require('../models');

module.exports = {
    index: function(req, res) {
        if (req.user.kind != models.USER_ADMIN) {
            return res.send(403);
        }

        models.RestaurantModel
            .find()
            .select("_id name foods.id")
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
            .select("_id name description foods._id orders._id")
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
        res.send('edit restaurant ' + req.restaurant.title);
    },

    update: function(req, res) {
        res.send('update restaurant ' + req.restaurant.title);
    },

    destroy: function(req, res) {
        res.send('destroy restaurant ' + req.restaurant.title);
    }
};
