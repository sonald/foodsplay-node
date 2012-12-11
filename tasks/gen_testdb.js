#!/usr/bin/env node

var mongoose = require('mongoose'),
    async = require('async');

var db = mongoose.createConnection('127.0.0.1', 'foodsplay');
var models = require('../models')(db);
db.once('open', function() {
    console.log('connect to database');

    // var newUser = new models.UserModel(data);
    // newUser.save(function(err) {
    // });

    var aRestaurant = new models.RestaurantModel({
        name: '成都小吃',
        // 菜品列表
        foods: [
            {
                name: {zh: "宫保鸡丁", en: "gongbao chicken"},
                description: {
                    zh: "一种很好吃的食物",
                    en: "a very famous delicious food"
                },
                price: 12,
                memberPrice: 9,
                category: 0, // 0:热菜，1：凉菜，2：海鲜，3：点心
                unit: 0, // 份，斤，瓶，罐，盘
                status: 0, // 0: available, 1: not-available
                inspecial: false, // if true, use special price
                specialPrice: 10,
                picture: "/upload/images/restaurants/50b4d3d50f273a864a000006/foods/gongbao.jpg"
            },
            {
                name: {zh: "夫妻肺片", en: "husband and wife's lung"},
                description: {
                    zh: "一种很好吃的食物",
                    en: "a very famous delicious food"
                },
                price: 24,
                memberPrice: 20,
                category: 0, // 0:热菜，1：凉菜，2：海鲜，3：点心
                unit: 0, // 份，斤，瓶，罐，盘
                status: 0, // 0: available, 1: not-available
                inspecial: true, // if true, use special price
                specialPrice: 10,
                picture: "/upload/images/restaurants/50b4d3d50f273a864a000006/foods/lungs.jpg"
            }
        ],

        // 过往结帐单
        "bills": [
            {
                billid: '20120617-0001',
                date: new Date(),
                items: [
                    { food_id: 1, count: 2 }
                ],
                status: 1 // 0: in-order, 1: checked
            }
        ],

        orders: [
            {
                orderid: '20121125-0010',
                date: new Date(),
                items: [
                    {
                        food_id: 1,
                        specification: 0, // 0: big, 1: small, 2:例
                        count: 2,
                        favor: '清淡', // 口味
                        request: '要求',
                        method: '做法',
                        other: '其他',
                        status: '已上菜' // 已上菜，已下单
                    }
                ],
                guestNumber: 4
            }
        ]
    });

    var aRestaurant2 = new models.RestaurantModel({
        name: '重庆小吃',
        // 菜品列表
        foods: [
            {
                name: {zh: "宫保鸡丁", en: "gongbao chicken"},
                description: {
                    zh: "一种很好吃的食物",
                    en: "a very famous delicious food"
                },
                price: 12,
                memberPrice: 9,
                category: 0, // 0:热菜，1：凉菜，2：海鲜，3：点心
                unit: 0, // 份，斤，瓶，罐，盘
                status: 0, // 0: available, 1: not-available
                inspecial: false, // if true, use special price
                specialPrice: 10,
                picture: "/upload/images/restaurants/50b4d3d50f273a864a000006/foods/gongbao.jpg" //path in server
            },
            {
                name: {zh: "夫妻肺片", en: "husband and wife's lung"},
                description: {
                    zh: "一种很好吃的食物",
                    en: "a very famous delicious food"
                },
                price: 24,
                memberPrice: 20,
                category: 0, // 0:热菜，1：凉菜，2：海鲜，3：点心
                unit: 0, // 份，斤，瓶，罐，盘
                status: 0, // 0: available, 1: not-available
                inspecial: true, // if true, use special price
                specialPrice: 10,
                picture: "/upload/images/restaurants/50b4d3d50f273a864a000006/foods/lungs.jpg" //path in server
            }
        ],

        // 过往结帐单
        "bills": [
            {
                billid: '20120617-0001',
                date: new Date(),
                items: [
                    { food_id: 1, count: 2 }
                ],
                status: 1 // 0: in-order, 1: checked
            }
        ],

        orders: [
            {
                orderid: '20121125-0010',
                date: new Date(),
                items: [
                    {
                        food_id: 1,
                        specification: 0, // 0: big, 1: small, 2:例
                        count: 2,
                        favor: '清淡', // 口味
                        request: '要求',
                        method: '做法',
                        other: '其他',
                        status: '已上菜' // 已上菜，已下单
                    }
                ],
                guestNumber: 4
            }
        ]
    });

    models.RestaurantModel.remove(function(err) {
        console.log('drop old done');
        aRestaurant.save(function(err) {
            if (err) {
                console.log(err.message);
            }

            aRestaurant2.save(function(err2) {
                if (err2) {
                    console.log(err.message);
                }

                console.log('create restaurant done');
                db.close();
                process.exit(0);
            });
        });
    });
});
