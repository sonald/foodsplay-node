function RestaurantViewModel(initial) {
    var self = this;
    self.restaurant = ko.observable(initial);
    console.log(initial);

    self.base = ko.computed(function() {
        return "#/restaurants/" + self.restaurant()._id;
    });

    ['edit', 'delete', 'foods', 'employees', 'orders', 'members'].forEach(function(dest) {
        self[dest + 'Url'] = ko.computed(function() {
            return self.base() + '/' + dest;
        });
    });

    self.putRestaurantUrl = ko.computed(function() {
        return "/restaurants/" + self.restaurant()._id;
    });

    var fields = '#app-content input:not([type="submit"]):visible, textarea';
    self.initValidation(fields, {
        'description.en, description.zh, name.en, name.zh': {
            required: true,
            min_length: 2
        }
    });
}

ValidationMixin.call(RestaurantViewModel.prototype);

function RestaurantsViewModel(initial) {
    var self = this;

    self.restaurants = ko.observableArray(initial);
};
