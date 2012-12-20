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
            var orders = restaurant.orders;
            orders.push({
                date: new Date(),
                items: [
                    {
                        food: foods[0]._id,
                        specification: 0,
                        count: 1,
                        favor: "favor sugar",
                        request: "no request",
                        method: "do it simple",
                        other: "nothing",
                        status: models.ORDER_ITEM_FRESH
                    },
                    {
                        food: foods[1]._id,
                        specification: 1,
                        count: 2,
                        favor: "favor bitter",
                        request: "no request too",
                        method: "do it simpler",
                        other: "nothing at all",
                        status: models.ORDER_ITEM_FRESH
                    }
                ],
                guestNumber: 4,
                table: 1,
                status: models.ORDER_OPEN
            });

            orders.push({
                date: new Date(),
                items: [
                    {
                        food: foods[0]._id,
                        specification: 1,
                        count: 2,
                        favor: "favor 3",
                        request: "no request",
                        method: "do it simple",
                        other: "nothing",
                        status: models.ORDER_ITEM_FRESH
                    },
                    {
                        food: foods[1]._id,
                        specification: 1,
                        count: 2,
                        favor: "favor bitter",
                        request: "no request too",
                        method: "do it simpler",
                        other: "nothing at all",
                        status: models.ORDER_ITEM_FRESH
                    }
                ],
                guestNumber: 4,
                table: 2,
                status: models.ORDER_OPEN
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
