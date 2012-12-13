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

    self.validationErrors = ko.observable("");
    self.validate = function() {
        if (self.validator) {
            var result = self.validator.runValidations();
            console.log(result);
            if (!result.valid) {
                self.validationErrors(result.messages.join(",").trim());
            }
            return result.valid;
        }
        return true;
    };

    var fields = '#app-content input:not([type="submit"]):visible, textarea';
    self.setupValidation = function() {
        var vd = self.validator = FormValidator($(fields));
        vd.addValidation("name.en", {
            required: true
        });

        vd.addValidation("name.zh", {
            required: true
        });

        vd.addValidation("description.en", {
            min_length: 2,
            required: true
        });

        vd.addValidation("description.zh", {
            min_length: 2,
            required: true
        });
    };
}

// only admin can access this
function UsersViewModel(initial) {
    var self = this;

    self.users = ko.observableArray(initial);
};

UsersViewModel.USER_NORMAL = 1;
UsersViewModel.USER_RESTAURANT = 2;
UsersViewModel.USER_ADMIN = 3;
