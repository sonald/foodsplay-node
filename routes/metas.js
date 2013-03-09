var util = require('util'),
    models = require('../models');

exports.index = function(req, res) {
    if (req.user.kind == models.USER_NORMAL) {
        return res.send(403);
    }

    models.RestaurantModel
        .findById(req.params.restaurant)
        .select("metas")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            res.send(JSON.stringify(restaurant.metas));
        });
};
