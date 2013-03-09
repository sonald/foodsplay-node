// help routines for routers

var models = require('../models'),
    fs = require('fs');

const userKinds = {
    'normal': models.USER_NORMAL,
    'admin': models.USER_ADMIN,
    'restaurant': models.USER_RESTAURANT
};

exports.isUser = function(predicate, req) {
    if (typeof predicate === 'string') {
        return req.user.kind == userKinds[predicate];

    } else {
        return req.user.kind == predicate;
    }
};

exports.lookupRestaurant = function(userid, restaurantid) {
    return true;
};
