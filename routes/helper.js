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

// fields is like: ['name.en', 'description.en', ...]
exports.updateFields = function(obj, schema, data) {
    Object.keys(data).forEach(function(path) {
        if (!schema.path(path)) {
            return;
        }

        if (path.indexOf('.') > -1) {
            eval('obj.' + path + '=' + JSON.stringify(data[path]));

        } else if (path in obj) {
            obj[path] = data[path];
        }
    });
};
