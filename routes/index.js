//TODO: dynamically load all routes from here

var resource = require('express-resource'),
    models = require('../models'),
    util = require('util');

function checkAuth(req, res, next) {
    var sess = req.session,
    auth = sess.auth,
    loggedIn = !!(auth && auth.loggedIn);

    if (!loggedIn && req.url != '/users/signin') {
        return res.redirect('/users/signin');
    }

    return next();
}

exports.setup = function(app) {
    app.all('*', checkAuth);
    app.get('/', index);

    var default_opts = {
        format: 'json'
    };

    app.resource("businessusers", require('./businessusers'), default_opts);
    app.resource("publicusers", require('./publicusers'), default_opts);
    var restaurants = app.resource("restaurants", require('./restaurant'), default_opts);
    var foods = app.resource("foods", require('./foods'), default_opts);

    restaurants.add(foods);
};

/*
 * GET home page.
 */

function index(req, res) {
    var userid = req.user._id;

    console.log('requesting /');
    switch(req.user.kind) {
    case models.USER_ADMIN:
        return res.render('index', { title: 'Express' });

    case models.USER_NORMAL:
        return res.redirect(util.format('/publicusers/%d'), 303);

    case models.USER_RESTAURANT:
        models.RestaurantModel
            .findOne({_user: userid})
            .select('_id')
            .exec(function(err2, restaurant) {
                console.log('find: ', err2, restaurant);
                if (err2) {
                    return res.send(403);
                }

                if (!restaurant) {
                    //TODO: go to create restaurant
                    return res.redirect(util.format('/businessusers/%s', userid));
                }

                return res.redirect(util.format('/restaurants/%s', restaurant.id), 303);
            });
    }
 };
