var util = require('util'),
    models = require('../models'),
    helper = require('./helper');

exports.index = function(req, res) {
    if (helper.isUser('normal', req)) {
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

var assemble = function(kind, b) {
    switch(kind) {
    case 'table':
        return {
            name: {
                zh: b['name.zh'],
                en: b['name.en']
            },
            floor: Number(b['floor']),
            status: Number(b['status'])
        };

    default:
        return {
            name: {
                zh: b['name.zh'],
                en: b['name.en']
            }
        };
    }
};

var metaKeys = {
    'table': 'tables',
    'category': 'categories',
    'unit': 'units',
    'flavor': 'flavors'
};

//tricky: need include {'kind': 'category|...'} inside body
exports.create = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    var b = req.body,
        meta = assemble(b['kind'], b),
        updatedMeta = {};

    updatedMeta['metas.' + metaKeys[b['kind']]] = meta;
    console.log('new meta: ', meta);

    models.RestaurantModel.update(
        {_id: req.params.restaurant},
        {$push: updatedMeta},
        function(err, numAffected) {
            if (err) {
                console.log(err);
            }

            console.log('updated meta are ', numAffected);
            res.redirect('#/restaurants/' + req.params.restaurant + '/metas');
        });
};

//update with kind=(table|category|....)
exports.update = function(req, res) {
    //FIXME: can't do that now ( no id )
};

exports.destroy = function(req, res) {
    //FIXME: can't do it either
};
