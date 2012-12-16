function RestaurantViewModel(initial) {
    var self = this;
    self.restaurant = ko.observable(initial);
    console.log(initial);

    self.base = ko.computed(function() {
        return "#/restaurants/" + self.restaurant()._id;
    });

    ['edit', 'delete', 'foods', 'employees', 'orders'].forEach(function(dest) {
        self[dest + 'Url'] = ko.computed(function() {
            return self.base() + '/' + dest;
        });
    });

    self.putRestaurantUrl = ko.computed(function() {
        return "/restaurants/" + self.restaurant()._id;
    });

    self.validate = function() { return true; };
}

function RestaurantsViewModel(initial) {
    var self = this;

    self.restaurants = ko.observableArray(initial);
};
