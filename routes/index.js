//TODO: dynamically load all routes from here
var blogs = require('./blogs'),
    user = require('./users');

function csrf(req, res, next) {
    res.locals.csrf_token = req.session._csrf;
    next();
}

exports.setup = function(app) {
    app.get('/', index);

    app.get('/blogs', blogs.index);
    app.get('/blogs/:id', blogs.show);
};

/*
 * GET home page.
 */

function index(req, res) {
    res.render('index', { title: 'Express' });
};
