#!/usr/bin/env node

var mongoose = require('mongoose'),
    async = require('async');

mongoose.connect('127.0.0.1', 'foodsplay');
mongoose.connection.once('open', function() {
    console.log('connect to database');
    var models = require('../models');

    var user = models.UserModel.findById('51038c027d5c2ceb2a000008')
    .exec(function(err, user) {
    var aRestaurant = new models.RestaurantModel({
        name: {
            zh: '成都小吃',
            en: 'chengdu xiaochi'
        },

        description: {
            zh: '成都小吃',
            en: 'chengdu xiaochi'
        },

        //_user: user  // both are work
        _user:'51038c027d5c2ceb2a000008',

        metas: {
            tables: [
                {
                    name: {
                        zh: '1-1号',
                        en: 'No.1-1'
                    },
                    floor: 1,
                    status: models.TABLE_FREE.value
                },

                {
                    name: {
                        zh: '1-2号',
                        en: 'No.1-2'
                    },
                    floor: 1,
                    status: models.TABLE_FREE.value
                },

                {
                    name: {
                        zh: '2-1号',
                        en: 'No.2-1'
                    },
                    floor: 2,
                    status: models.TABLE_FREE.value
                }],

            flavors: [
                {
                    name: {
                        zh: '少糖',
                        en: 'no sugar'
                    }
                },

                {
                    name: {
                        zh: '少盐',
                        en: 'no salt'
                    }
                }],

            units: [
                {
                    name: {
                        zh: '份',
                        en: 'fen'
                    }
                },

                {
                    name: {
                        zh: '斤',
                        en: 'jin'
                    }
                }],

            categories: [
                {
                    name: {
                        zh: '川菜',
                        en: 'chuancai'
                    }
                },

                {
                    name: {
                        zh: '凉菜',
                        en: 'liangcai'
                    }
                }]
        }
    });

   aRestaurant.save(function(err) {
        if (err) {
            console.log(err.message);
        }

       // now add foods
       console.log('create restaurant done');
       mongoose.connection.close();
       process.exit(0);

   });
    });
/*

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
*/
});
