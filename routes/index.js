//TODO: dynamically load all routes from here

var resource = require('express-resource');

function csrf(req, res, next) {
    res.locals.csrf_token = req.session._csrf;
    next();
}

exports.setup = function(app) {
    app.get('/', index);

    var default_opts = {
        format: 'json'
    };
    var restaurants = app.resource("restaurants", require('./restaurant')(app), default_opts);
    var foods = app.resource("foods", require('./foods'), default_opts);
    restaurants.add(foods);
};

/*
 * GET home page.
 */

function index(req, res) {
    if (req.session.auth && req.session.auth.loggedIn) {
        res.render('index', { title: 'Express' });
    } else {
        res.redirect('/users/signin');
    }
};
