function OrderViewModel(restaurantid, initialOrder) {
}

function OrdersViewModel(restaurantid, initialOrders) {
    var self = this;
    // var thumburls = ["origin", "48x48", "128x128"].map(function(size) {
    //     return "/upload/images/restaurants/" + restaurantid + "/foods/" + size;
    // });

    self.ORDER_ITEM_FRESH = 1;
    self.ORDER_ITEM_CONFIRMED = 2;
    self.ORDER_ITEM_DONE = 3;

    initialOrders.forEach(function(order) {
        order.items.forEach(function(item) {
            // item.food.thumbs = thumburls.map(function(url) {
            //     return url + '/' + item.food.picture;
            // });

            item.statusName = ko.computed(function() {
                switch(item.status) {
                case self.ORDER_ITEM_FRESH: return 'new';
                case self.ORDER_ITEM_CONFIRMED: return 'confirmed';
                case self.ORDER_ITEM_DONE: return 'done';
                }
            });
        });
    });

    self.orders = ko.observableArray(initialOrders);

    self.currentRestaurant = ko.observable(restaurantid);

    self.currentOrder = ko.observable("");
    self.selectOrder = function(order) {
        self.currentOrder(order);
    };
}
