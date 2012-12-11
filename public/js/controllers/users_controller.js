function Restaurant() {
   this.name = {
        zh: ko.observable(""),
        en: ko.observable("")
    };

    this.description = {
        zh: ko.observable(""),
        en: ko.observable("")
    };
}

function UserViewModel(initial) {
    var self = this;
    self.user = ko.observable(initial);

    self.hasRestaurant = ko.computed(function() {
        return !!self.user.restaurant;
    });

    self.isAdmin = ko.computed(function() {
        return self.user.kind == 3;
    });

    self.isRestaurantUser = ko.computed(function() {
        return self.user.kind == 2;
    });

    self.newRestaurantUrl = ko.computed(function() {
        return "#/restaurants/new";
    });

    self.restaurantUrl = ko.computed(function() {
        return "#/restaurants" + self.user.restaurant;
    });

    self.newRestaurant = ko.observable(new Restaurant);
    self.newRestaurantValid = ko.computed(function() {
        return self.newRestaurant().name.zh().trim().length > 0;
    });
}

// only admin can access this
function UsersViewModel(initial) {
    var self = this;

    self.users = ko.observableArray(initial);
};

UsersViewModel.USER_NORMAL = 1;
UsersViewModel.USER_RESTAURANT = 2;
UsersViewModel.USER_ADMIN = 3;
