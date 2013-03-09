var util = require('util'),
    models = require('../models');

// default send open orders
exports.index = function(req, res) {
    exports.live.call(this, req, res);
};

// current orders
exports.live = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findById(req.params.restaurant)
        .select("orders foods")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(403);
            }

            var orders = restaurant.orders.filter(function(order) {
                return order.status == models.ORDER_OPEN.value;
            })

            //HACK: manually populate nested food, cause mongoose does
            //not support it right now. see issue601
            orders = orders.map(function(order) {
                order = order.toObject({minimize: false});
                order.items.forEach(function(item) {
                    item.food = restaurant.foods.id(item.food);
                });

                return order;
            });

            res.send(JSON.stringify(orders));
        });
};

// archive orders
exports.archive = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findById(req.params.restaurant)
        .select("orders foods")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(403);
            }

            var orders = restaurant.orders.filter(function(order) {
                return order.status == models.ORDER_CLOSED.value;
            })

            orders = orders.map(function(order) {
                order = order.toObject({minimize: false});
                order.items.forEach(function(item) {
                    item.food = restaurant.foods.id(item.food);
                });

                return order;
            });

            res.send(JSON.stringify(orders));
        });
};

exports.create = function(req, res) {
    var b = req.body;

    var newOrder = {
        date: new Date(),
        guestNumber: b['guestNumber'],
        table: b['table'],
        status: models.ORDER_OPEN.value
    };

    models.RestaurantModel.update(
        {_id: req.params.restaurant},
        {$push: { orders: newOrder }},
        function(err, numAffected) {
            if (err) {
                console.log(err);
                return res.send(403);
            }

            res.redirect('#/restaurants/' + req.params.restaurant);
        });
};

exports.update = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    var b = req.body;

};
