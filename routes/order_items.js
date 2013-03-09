var util = require('util'),
    models = require('../models');

exports.index = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findById(req.params.restaurant)
        .select("orders")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            res.send(JSON.stringify(restaurant.orders.id(req.params.order).items));
        });
};

exports.create = function(req, res) {
    var b = req.body;

    var newItem = {
        food: b['food'],
        specification: b['specification'],
        count: b['count'],
        favor: b['favor'],
        request: b['request'],
        method: b['method'],
        other: b['other'],
        status: models.ORDER_ITEM_FRESH.value
    };

    models.RestaurantModel.findById(req.params.restaurant, function(err, restaurant) {
        if (err) {
            console.log(err);
            return res.send(403);
        }

        var order = restaurant.orders.id(req.params.order);
        order.items.push(newItem);
        order.save(function(err) {
            if (err) {
                console.log(err);
                return res.send(403);
            }

            return res.send(200);
        });

    });
};

exports.update = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }
};
