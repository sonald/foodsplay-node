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

            var members = restaurant.members;
            members.push({
                name: "Sian Cao",
                sex: 1,
                birth: new Date(),
                icnum: "327854691",
                address: "Haidian Road, Beijing",
                phone: "010-56782111",
                mobile: "15812345678",
                email: "a@c.com",
                cardid: "327854691",
                kind: 0,
                credits: 12,
                history: []
            });

            members.push({
                name: "Peng Hao",
                sex: 2,
                birth: new Date(),
                icnum: "627854691",
                address: "Haidian Road, Beijing",
                phone: "010-56782111",
                mobile: "15812345678",
                email: "a@c.com",
                cardid: "327854691",
                kind: 0,
                credits: 1,
                history: []
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
