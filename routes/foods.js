var formidable = require('formidable'), // bodyParser integrate formidable already!
    util = require('util'),
    models = require('../models'),
    fs = require('fs'),
    pathlib = require('path'),
    easyimg = require('easyimage'),
    sh = require('shelljs'),
    helper = require('./helper');

exports.index = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    if (!helper.lookupRestaurant(req.user._id, req.params.restaurant)) {
        return res.send(403);
    }

    var filter = (function() {
        if (req.query.category) {
            return function(food) {
                return food.category == req.query.category;
            };
        }

        return function(food) { return true; };
    }());

    models.RestaurantModel
        .findOne({_id: req.params.restaurant})
        .select("foods metas.categories metas.units")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            //HACK: manually populate nested food, cause mongoose does
            //not support it right now. see issue601
            var foods = restaurant.foods.filter(filter).map(function(food) {
                food = food.toObject({minimize: false});
                food.category = restaurant.metas.categories.id(food.category);
                food.unit = restaurant.metas.units.id(food.unit);
                return food;
            });

            res.send(JSON.stringify(foods));
        });
};

exports.create = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    var b = req.body;
    var foodspath = pathlib.join("/upload/images/restaurants", req.params.restaurant, "foods");
    var picname = req.files.picture.name;

    var thumbs = ['origin', '48x48', '128x128'].map(function(size) {
        var destdir = pathlib.join(__dirname, "../public/", foodspath, size);
        sh.mkdir('-p', destdir);

        var filepath = pathlib.join(destdir, picname);
        if (size == 'origin') {
            fs.writeFileSync(filepath, fs.readFileSync(req.files.picture.path));

        } else {
            var matches = /(\d+)x(\d+)/.exec(size);
            easyimg.resize({
                src: req.files.picture.path,
                dst: filepath,
                width: matches[1],
                height: matches[2]
            }, function(err, stdout, stderr) {
                if (err) console.log(err);
                console.log('Resized to ' + size);
            });
        }

        return "/upload/images/restaurants/" + req.params.restaurant + "/foods/" +
            size + '/' + picname;
    });

    var newFood = {
        name: {
            zh: b['name.zh'],
            en: b['name.en']
        },
        description: {
            zh: b['description.zh'],
            en: b['description.en']
        },
        price: Number(b['price']),
        memberPrice: Number(b['memberPrice']),
        //TODO: check category & unit is valid (exists or not)
        category: b['category'],
        unit: b['unit'],
        status: Number(b['status']),
        inspecial: Boolean(b['inspecial']),
        specialPrice: Number(b['specialPrice']),
        // store only name part of picture (cause there are a lot of thumbs)
        picture: picname,
        thumbs: thumbs
    };

    console.log('newFood: ', newFood);

    models.RestaurantModel.update(
        {_id: req.params.restaurant},
        {$push: { foods: newFood }},
        function(err, numAffected) {
            if (err) {
                console.log(err);
            }

            console.log('updated foods are ', numAffected);
            res.redirect('#/restaurants/' + req.params.restaurant + '/foods');
        });
};

exports.show = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    models.RestaurantModel
        .findOne({ _id: req.params.restaurant })
        .elemMatch('foods', {_id: req.params.food})
        .select('foods metas.categories metas.units')
        .exec(function(err, restaurant) {
            if (err || !restaurant) {
                return res.send(406);
            }

            //HACK: manually populate nested food, cause mongoose does
            //not support it right now. see issue601
            var food = restaurant.foods.id(req.params.food);
            food = food.toObject({minimize: false});
            food.category = restaurant.metas.categories.id(food.category);
            food.unit = restaurant.metas.units.id(food.unit);
            res.send(JSON.stringify(food));
        });
};

exports.update = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    var b = req.body;
    console.log('params: ', req.params, 'b: ', b);

    models.RestaurantModel
        .findById(req.params.restaurant, function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            var food = restaurant.foods.id(req.params.food);
            helper.updateFields(food, models.FoodModel.schema, b);

            console.log(food);
            restaurant.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(403);
                }
                return res.send(200);
            });
        });
};

exports.destroy = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    var b = req.body;
    console.log('params: ', req.params, 'b: ', b);

    models.RestaurantModel
        .findById(req.params.restaurant, function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            var food = restaurant.foods.id(req.params.food);
            if (food) {
                food.remove();
            }
            restaurant.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(403);
                }

                return res.send(200);
            });
        });
};
