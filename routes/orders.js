var util = require('util'),
    models = require('../models');

// default send open orders
// query:
//   ?table=tid
//   ?status=live
//   ?status=archive
exports.index = function(req, res) {
    console.log(req.query);
    req.query.status = req.query.status || {status: 'live'};

    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    var filter_status = (function() {
        if (req.query.status == 'live') {
            return function(order) {
                return order.status == models.ORDER_OPEN.value;
            };

        } else if (req.query.status == 'archive') {
            return function(order) {
                return order.status == models.ORDER_CLOSED.value;
            };

        } else {
            return function(order) {
                return true;
            };
        }
    }());

    var filter_op = req.query.table ? function(order) {
        // this is before populate, so table now is ObjectId
        return filter_status(order) && order.table == req.query.table;
    }: filter_status;

    models.RestaurantModel
        .findById(req.params.restaurant)
        .select("orders foods metas.tables metas.flavors")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(403);
            }

            console.log(filter_op.toString());
            var orders = restaurant.orders.filter(filter_op);

            //HACK: manually populate nested food, cause mongoose does
            //not support it right now. see issue601
            orders = orders.map(function(order) {
                order = order.toObject({minimize: false});
                order.items.forEach(function(item) {
                    item.food = restaurant.foods.id(item.food);
                    item.flavor = restaurant.metas.flavors.id(item.flavor);
                });
                order.table = restaurant.metas.tables.id(order.table);
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

    console.log('params: ', req.params, 'b: ', b);

    models.RestaurantModel
        .findById(req.params.restaurant, function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            var order = restaurant.orders.id(req.params.order);
            helper.updateFields(order, models.OrderModel.schema, d);

            console.log(order);
            restaurant.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(403);
                }
                return res.send(200);
            });
        });
};
