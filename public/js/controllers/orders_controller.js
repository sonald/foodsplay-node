function OrderViewModel(restaurantid, initialOrder) {
}

function OrdersViewModel(restaurantid, initialOrders) {
    var self = this;
    self.orders = ko.observableArray(initialOrders);

    self.currentRestaurant = ko.observable(restaurantid);
}

// ValidationMixin.call(OrdersViewModel.prototype);
