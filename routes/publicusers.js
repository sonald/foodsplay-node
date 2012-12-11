var formidable = require('formidable'), // bodyParser integrate formidable already!
    util = require('util'),
    models = require('../models');

module.exports = {
    index: function(req, res) {
        if (req.user.kind == models.USER_RESTAURANT) {
            res.send(403);
        } else {
            //TODO: 
        }
    },

    show: function(req, res) {
        if (req.user.kind == models.USER_RESTAURANT) {
            res.send(403);
        } else {
            //TODO:
        };        
    }
};
