//TODO: dynamically load all routes from here

var resource = require('express-resource'),
    models = require('../models'),
    util = require('util');

function checkAuth(req, res, next) {
    console.log('body: ' + util.inspect(req.body));
    console.log('cookies: ' + util.inspect(req.cookies));
    console.log('env: ' + req.app.get('env'));
    console.log('session: ', req.session);
    console.log('req.user: ', req.user);
    console.log('req.url: ', req.url);
    console.log('params: ', req.params);
    console.log('everyauth: ', res.locals.everyauth);


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
    app.get('/config.js', config);
    app.get('/', index);
    app.get('/admin', admin);

    var default_opts = {
        format: 'json'
    };


    app.resource("businessusers", require('./businessusers'), default_opts);
    app.resource("publicusers", require('./publicusers'), default_opts);
    var restaurants = app.resource("restaurants", require('./restaurant'), default_opts);
    var foods = app.resource("foods", require('./foods'), default_opts);
    var members = app.resource("members", require('./members'), default_opts);
    var employees = app.resource("employees", require('./employees'), default_opts);
    var orders = app.resource("orders", require('./orders'), default_opts);
    var order_items = app.resource("items", require('./order_items'), default_opts);
    var metas = app.resource("metas", require('./metas'), default_opts);

    restaurants.add(foods);
    restaurants.add(members);
    restaurants.add(employees);
    orders.add(order_items);
    restaurants.add(orders);
    restaurants.add(metas);
};

function config(req, res) {
    var userid = req.user._id;
    var data = {
        //HACK: req.user can not be Object.keys-ed, everyauth restriction
        user: JSON.parse(JSON.stringify(req.user))
    };

    res.set('Content-Type', 'text/javascript');

    switch(req.user.kind) {
    case models.USER_RESTAURANT:
        models.RestaurantModel
            .findOne({_user: userid})
            .select('_id')
            .exec(function(err, restaurant) {
                if (err) {
                    return res.send(403);
                }

                if (restaurant) {
                    data.user.restaurant = restaurant._id;
                }
                res.send('var CONFIG = ' + JSON.stringify(data));
            });
        break;

    default:
        res.send('var CONFIG = ' + JSON.stringify(data));
    }
}

/*
 * GET home page.
 */

function index(req, res) {
    return res.render('index');
}

// admin data
function admin(req, res) {
    if (req.user.kind !== models.USER_ADMIN) {
        return res.send(403);
    }

    var admin = {};
    models.RestaurantModel
        .find()
        .populate('_user')
        .select("name description _id _user")
        .exec(function(err, restaurants) {
            if (err) {
                return res.send(406);
            }

            admin.restaurants = restaurants;
            res.send(JSON.stringify(admin));
        });
}
