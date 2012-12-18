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
        return !!self.user().restaurant;
    });

    self.isAdmin = ko.computed(function() {
        return self.user().kind == UsersViewModel.USER_ADMIN;
    });

    self.isRestaurantUser = ko.computed(function() {
        return self.user().kind == UsersViewModel.USER_RESTAURANT;
    });

    self.postNewRestaurantUrl = ko.computed(function() {
        return "/restaurants";
    });

    self.newRestaurantUrl = ko.computed(function() {
        return '#' + self.postNewRestaurantUrl() + '/new';
    });

    self.restaurantUrl = ko.computed(function() {
        return "#/restaurants/" + self.user().restaurant;
    });

    self.newRestaurant = ko.observable(new Restaurant);

    var fields = '#app-content input:not([type="submit"]):visible, textarea';
    self.initValidation(fields, {
        "name.zh, name.en": {
            required: true
        },

        "description.en, description.zh": {
            min_length: 2,
            required: true
        }
    });
}

ValidationMixin.call(UserViewModel.prototype);

// only admin can access this
function UsersViewModel(initial) {
    var self = this;

    self.users = ko.observableArray(initial);
};

UsersViewModel.USER_NORMAL = 1;
UsersViewModel.USER_RESTAURANT = 2;
UsersViewModel.USER_ADMIN = 3;
