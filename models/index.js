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
});

module.exports = (function(db) {
    return {
        UserModel: db.model('User', UserSchema)
    };    
});
