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
    var serverpath = "public/upload/images/restaurants";
    var filepath = pathlib.join(serverpath, b.restaurantid, req.files.picture.name);    
    var destdir = pathlib.join(__dirname, "..", serverpath);
    
    console.log(destdir);
    console.log(typeof req.files.picture);
    
    sh.mkdir('-p', destdir);
    sh.cp('-f', req.files.picture.path, filepath);

    var newFood = {
        name: {
            zh: b['name.zh'],
            en: b['name.en']
        },
        description: {
            zh: b['description.zh'],
            en: b['description.en']
        },
        price: b.price,
        memberPrice: 9,
        category: 0, 
        unit: 0,
        status: 0,
        inspecial: false,
        specialPrice: 10,
        picture: filepath
    };

    models.RestaurantModel.findByIdAndUpdate(
        b.restaurantid,
        {$push: { foods: newFood }},
        function(err, newRestaurant) {
            if (err) {
                console.log(err);
            }
            
            console.log('newRestaurant: ', newRestaurant);
        });
    
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: req.body, files: req.files}, true, null));
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
