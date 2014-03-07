var 
    util = require('util'),
    models = require('../models');

module.exports = {
    index: function(req, res) {
        if (req.user.kind == models.USER_ADMIN) {
            //TODO:
        } else {
            res.send(403);
        }
    },

    // only login user can request its own info or admin
    show: function(req, res) {
        console.log(req.params, req.format);

        if (req.params['businessuser'] != req.user._id) {
            return res.send(403);
        }

        if (req.user.kind == models.USER_RESTAURANT) {
            models.UserModel
                .findOne({_id: req.user._id})
                .select('username _id kind email')
                .exec(function(err, user) {
                    if (err) {
                        return res.send(404);
                    }

                    models.RestaurantModel
                        .findOne({_user: user._id})
                        .select('_id')
                        .exec(function(err2, restaurant) {
                            if (err2) {
                                return res.send(404);
                            }

                            user = JSON.parse(JSON.stringify(user));
                            if (restaurant) {
                                user.restaurant = restaurant._id;
                            }
                            res.send(JSON.stringify(user));
                        });
                });

        } else {
            res.send(403);
        };
    }
};
