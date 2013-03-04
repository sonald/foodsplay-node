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

    models.RestaurantModel
        .findOne({_id: req.params.restaurant})
        .select("foods")
        .exec(function(err, restaurant) {
            if (err) {
                res.send(406);
            } else {
                res.send(JSON.stringify(restaurant.foods));
            }
        });
};

exports.create = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    var b = req.body;
    var foodspath = pathlib.join("/upload/images/restaurants", b.restaurantid, "foods");
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

        return "/upload/images/restaurants/" + b.restaurantid + "/foods/" +
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
        {_id: b.restaurantid},
        {$push: { foods: newFood }},
        function(err, numAffected) {
            if (err) {
                console.log(err);
            }

            console.log('updated foods are ', numAffected);
            res.redirect('#/restaurants/' + b.restaurantid + '/foods');
        });
};

exports.show = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    models.RestaurantModel
        .findOne({ _id: req.params.restaurant })
        .elemMatch('foods', {_id: req.params.food})
        .select('foods')
        .exec(function(err, restaurant) {
            if (err || !restaurant) {
                return res.send(406);
            }

            res.send(JSON.stringify(restaurant.foods.id(req.params.food)));
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
            Object.keys(b).map(function(path) {
                if (path.indexOf('.') > -1) {
                    eval('food.' + path + '=' + JSON.stringify(b[path]));
                } else if (path in food) {
                    food[path] = b[path];
                }
            });

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
