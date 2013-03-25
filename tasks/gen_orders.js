var mongoose = require('mongoose'),
    models = require('../models');

mongoose.connect('127.0.0.1', 'foodsplay');
mongoose.connection.once('open', function() {
    console.log('connect to database');

    models.RestaurantModel
        .findOne()
        .exec(function(err, restaurant) {
            if (err) {
                return console.log(err);
            }

            var foods = restaurant.foods;
            var tables = restaurant.metas.tables;
            var flavors = restaurant.metas.flavors;
            // var tables = restaurant.metas.tables;
            var orders = restaurant.orders;
            orders.push({
                date: new Date(),
                items: [
                    {
                        food: foods[0]._id,
                        specification: 0,
                        count: 1,
                        flavor: flavors[0]._id,
                        request: "no request",
                        method: "do it simple",
                        other: "nothing",
                        status: models.ORDER_ITEM_FRESH
                    },
                    {
                        food: foods[1]._id,
                        specification: 1,
                        count: 2,
                        flavor: flavors[1]._id,
                        request: "no request too",
                        method: "do it simpler",
                        other: "nothing at all",
                        status: models.ORDER_ITEM_FRESH
                    }
                ],
                guestNumber: 4,
                table: tables[0]._id,
                status: models.ORDER_OPEN.value
            });

            orders.push({
                date: new Date(),
                items: [
                    {
                        food: foods[0]._id,
                        specification: 1,
                        count: 2,
                        flavor: flavors[0]._id,
                        request: "no request",
                        method: "do it simple",
                        other: "nothing",
                        status: models.ORDER_ITEM_FRESH
                    },
                    {
                        food: foods[1]._id,
                        specification: 1,
                        count: 2,
                        flavor: flavors[1]._id,
                        request: "no request too",
                        method: "do it simpler",
                        other: "nothing at all",
                        status: models.ORDER_ITEM_FRESH
                    }
                ],
                guestNumber: 4,
                table: tables[1]._id,
                status: models.ORDER_CLOSED.value
            });

            restaurant.save(function(err) {
                if (err) {
                    return console.log(err);
                }

                console.log('done');
                mongoose.disconnect();
            });
        });
});
