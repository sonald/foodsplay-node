
/*
 * GET users listing.
 */

exports.index = function(req, res) {
    res.send("respond with a resource");
};

exports.signup = function(req, res) {
    res.send("respond with a resource");
};

exports.signin = function(req, res) {
    console.log('go to signin', req.method);
    if (req.method === 'post') {
        console.log('post user');
        res.redirect('/');
    } else {
        res.render("user/signin", {title: "Please log in"});
    }
};
