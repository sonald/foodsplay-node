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
        models.RestaurantModel
            .find()
            .select("_id name foods.id")
            .exec(function(err, restaurants) {
                if (err) {
                    res.send(406);
                } else {
                    res.send(JSON.stringify(restaurants));
                }
            });
    },

    create: function(req, res) {
        res.send('create restaurant');
    },

    show: function(req, res) {
        models.RestaurantModel
            .findOne({_id: req.params.restaurant})
            .select("_id name foods._id foods.name orders._id orders.orderid")
            .exec(function(err, restaurant) {
                if (err) {
                    res.send(406);
                } else {
                    res.send(JSON.stringify(restaurant));
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
