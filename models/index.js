/**
 * all models all collected here
 */

var mongoose = require('mongoose'),
    fs = require('fs');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    type: Number // normal user or amdin or restaurant
}, {
    collection: 'users'
});


var RestaurantSchema = new mongoose.Schema({
    name: String,
    
    foods: [
        {
            name: {zh: String, en: String},
            description: { zh: String, en: String },
            price: Number,
            memberPrice: Number,
            category: Number,
            unit: Number,
            status: Number,
            inspecial: Boolean,
            specialPrice: Number,
            picture: String
        }
    ],

    "bills": [
        {
            billid: String,
            date: Date,
            items: [{ food_id: Number, count: Number }],
            status: Number
        }
    ],

    orders: [
        {
            orderid: String,
            date: Date,
            items: [
                {
                    food_id: Number,
                    specification: Number,
                    count: Number,
                    favor: String, 
                    request: String,
                    method: String,
                    other: String,
                    status: String
                }
            ],
            guestNumber: Number
        }
    ]
}, {
    collection: 'restaurants'
});

function Models(db) {
    console.log('building models');
    this.UserModel = db.model('User', UserSchema);
    this.RestaurantModel = db.model('Restaurant', RestaurantSchema);
}

module.exports = (function(db) {
    var models = new Models(db);
    module.exports = models;
    return models;
});
