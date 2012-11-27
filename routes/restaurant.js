// GET     /forums              ->  index
// GET     /forums/new          ->  new
// POST    /forums              ->  create
// GET     /forums/:forum       ->  show
// GET     /forums/:forum/edit  ->  edit
// PUT     /forums/:forum       ->  update
// DELETE  /forums/:forum       ->  destroy


module.exports = function(app) {
    var models = app.get('app config').models;
    return {
        index: function(req, res) {
            models.RestaurantModel
                .find()
                .select("_id name")
                .exec(function(err, restaurants) {
                if (err) {
                    res.send(406);
                } else {
                    res.send(JSON.stringify(restaurants));
                }
            });
        },

        create: function(req, res) {
            res.send('create forum');
        },

        show: function(req, res) {
            models.RestaurantModel
                .findOne({_id: req.params.restaurant})
                .exec(function(err, restaurant) {
                if (err) {
                    res.send(406);
                } else {
                    res.send(JSON.stringify(restaurant));
                }
            });
        },

        edit: function(req, res) {
            res.send('edit forum ' + req.forum.title);
        },

        update: function(req, res) {
            res.send('update forum ' + req.forum.title);
        },

        destroy: function(req, res) {
            res.send('destroy forum ' + req.forum.title);
        }
    };
};
