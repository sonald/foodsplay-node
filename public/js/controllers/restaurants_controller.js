function RestaurantViewModel(initial) {
    var self = this;
    self.restaurant = ko.observable(initial);

    self.foodsUrl = ko.computed(function() {
        return "#/restaurants/" + self.restaurant()._id + '/foods';
    });

    self.employeesUrl = ko.computed(function() {
        return "#/restaurants/" + self.restaurant()._id + '/employees';
    });

    self.ordersUrl = ko.computed(function() {
        return "#/restaurants/" + self.restaurant()._id + '/orders';
    });
    
}

function RestaurantsViewModel(initial) {
    var self = this;
    
    self.restaurants = ko.observableArray(initial);
};
