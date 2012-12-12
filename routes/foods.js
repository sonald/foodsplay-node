var formidable = require('formidable'), // bodyParser integrate formidable already!
    util = require('util'),
    models = require('../models'),
    fs = require('fs'),
    pathlib = require('path'),
    sh = require('shelljs');

exports.index = function(req, res) {
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
    var b = req.body;
    var foodspath = pathlib.join("/upload/images/restaurants", b.restaurantid, "foods");
    var fileurl = pathlib.join(foodspath, req.files.picture.name);

    var destdir = pathlib.join(__dirname, "../public/", foodspath);
    var filepath = pathlib.join(__dirname, "../public/", fileurl);


    sh.mkdir('-p', destdir);
    // sh.cp('-f', req.files.picture.path, filepath);
    fs.writeFileSync(filepath, fs.readFileSync(req.files.picture.path));

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
        picture: fileurl
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

exports.show = function(req, res){

};

// update({
//        _id: 7,
//        comments._id: ObjectId("4da4e7d1590295d4eb81c0c7")
//    },{
//        $set: {"comments.$.type": abc}
//    }, false, true
// );
