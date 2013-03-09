#!/usr/bin/env node

var mongoose = require('mongoose'),
    async = require('async');

mongoose.connect('127.0.0.1', 'foodsplay');
mongoose.connection.once('open', function() {
    console.log('connect to database');
    var models = require('../models');

    models.RestaurantModel
        .findById('51038c1b7d5c2ceb2a000009')
        .exec(function(err, restaurant) {
            // var restaurant = restaurants[0];
            console.log(restaurant.metas);
            restaurant.metas.tables.push({
                name: {
                    zh: '1-1∫≈',
                    en: 'No.1-1'
                },
                floor: 1,
                status: models.TABLE_FREE.value
            });

            restaurant.metas.tables.push({
                name: {
                    zh: '1-2∫≈',
                    en: 'No.1-2'
                },
                floor: 1,
                status: models.TABLE_FREE.value
            });

            restaurant.metas.tables.push({
                name: {
                    zh: '2-1∫≈',
                    en: 'No.2-1'
                },
                floor: 2,
                status: models.TABLE_FREE.value
            });

            restaurant.metas.flavors.push({
                name: {
                    zh: '…ŸÃ«',
                    en: 'no sugar'
                }
            });

            restaurant.metas.flavors.push({
                name: {
                    zh: '…Ÿ—Œ',
                    en: 'no salt'
                }
            });

            restaurant.metas.units.push({
                name: {
                    zh: '∑›',
                    en: 'fen'
                }
            });

            restaurant.metas.units.push({
                name: {
                    zh: 'ΩÔ',
                    en: 'jin'
                }
            });

            restaurant.metas.categories.push({
                name: {
                    zh: '¥®≤À',
                    en: 'chuancai'
                }
            });

            restaurant.metas.categories.push({
                name: {
                    zh: '¡π≤À',
                    en: 'liangcai'
                }
            });

            restaurant.save(function(err) {
                if (err) {
                    console.log(err.message);
                }

                console.log('create restaurant done');
                db.close();
                process.exit(0);
            });
        });
});
