var util = require('util'),
    models = require('../models'),
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
        .select("employees")
        .exec(function(err, restaurant) {
            if (err) {
                return res.send(406);
            }

            res.send(JSON.stringify(restaurant.employees));
        });
};

exports.create = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    var b = req.body;
    console.log('body is ', b, req.params);
    var newEmployee = {
        name: b['name'],
        password: b['password'], // hash it
        role: Number(b['role'])
    };

    console.log('newEmployee: ', newEmployee);

    models.RestaurantModel.update(
        {_id: req.params.restaurant},
        {$push: { employees: newEmployee }},
        function(err, numAffected) {
            if (err) {
                console.log(err);
                return res.send(406);
            }

            console.log('updated employees are ', numAffected);
            res.send({status: true});
        });
};

exports.show = function(req, res) {
    if (helper.isUser('normal', req)) {
        return res.send(403);
    }

    models.RestaurantModel
        .findOne({ _id: req.params.restaurant })
        .elemMatch('employees', {_id: req.params.employee})
        .exec(function(err, restaurant) {
            if (err || !restaurant) {
                return res.send(406);
            }

            var employee = restaurant.employees[0];
            res.send(JSON.stringify(employee));
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

            var employee = restaurant.employees.id(req.params.employee);
            Object.keys(b).map(function(path) {
                if (path.indexOf('.') > -1) {
                    eval('employee.' + path + '=' + JSON.stringify(b[path]));
                } else if (path in employee) {
                    employee[path] = b[path];
                }
            });

            console.log(employee);
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

            var employee = restaurant.employees.id(req.params.employee);
            if (employee) {
                employee.remove();
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
