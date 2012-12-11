var formidable = require('formidable'), // bodyParser integrate formidable already!
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

    show: function(req, res) {
        if (req.user.kind == models.USER_RESTAURANT) {
            // res.redirect('/restaurants/' + req.user._id);
            //TODO:
        } else {
            res.send(403);
        };
    }
};
