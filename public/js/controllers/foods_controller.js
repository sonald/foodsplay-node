function Food() {
    const FOOD_AVAILABLE = 1;
    const FOOD_UNAVAILABLE = 2;

    this.name = {
        zh: ko.observable(""),
        en: ko.observable("")
    };

    this.description = {
        zh: ko.observable(""),
        en: ko.observable("")
    };

    this.price = ko.observable(0);
    this.memberPrice = ko.observable(0);
    this.category = ko.observable(0);
    this.unit = ko.observable(0);
    this.status = ko.observable(FOOD_AVAILABLE);
    this.inspecial = ko.observable(false);
    this.specialPrice = ko.observable(0);
    this.picture = ko.observable("");
};

function FoodsViewModel(restaurantid, initialFoods) {
    var self = this;
    self.newFood = ko.observable(new Food);

    var thumburls = ["origin", "48x48", "128x128"].map(function(size) {
        return "/upload/images/restaurants/" + restaurantid + "/foods/" + size;
    });

    self.foods = ko.observableArray(ko.utils.arrayMap(initialFoods, function(food) {
        food.thumbs = thumburls.map(function(url) { return url + '/' + food.picture; });
        return food;
    }));

    self.foods = ko.observableArray(initialFoods);
    self.currentRestaurant = ko.observable(restaurantid);

    self.changeRestaurant = function(rid) {
    };

    self.postNewFoodUrl = ko.computed(function() {
        return '/restaurants/' + self.currentRestaurant() + '/foods';
    });

    self.newFoodUrl = ko.computed(function() {
        return '#' + self.postNewFoodUrl() + '/new';
    });

    self.addFood = function(restaurant) {
        window.location.hash = self.newFoodUrl() + '/new';
    };


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
        ['description.en', 'description.zh', 'name.en', 'name.zh'].forEach(function(field) {
            vd.addValidation(field, {
                required: true
            });
        });

        ['description.en', 'description.zh'].forEach(function(field) {
            vd.addValidation(field, {
                min_length: 2
            });
        });

        vd.addValidationMethod("need_picture", function(val) {
            var suffix = val.match( /\.\w+$/ );
            return suffix && ['png', 'jpg', 'tiff'].indexOf(suffix) != -1;
        }, "Field %F needs a picture type");

        vd.addValidation("picture", {
            need_picture: true,
            required: true
        });

        vd.addValidationMethod("need_number", function(val) {
            var r = Number(val);
            return val && !isNaN(r);
        }, "Field %F needs a valid number");

        ['price', 'memberPrice', 'category', 'unit'].forEach(function(field) {
            vd.addValidation(field, {
                required: true,
                need_number: true
            });
        });
    };
}
