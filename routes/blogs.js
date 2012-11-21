exports.index = function(req, res) {
    res.send('blogs.index');
};

exports.show = function(req, res) {
    
    res.send('blogs.show id = ' + req.id);
};

