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

    self.selectedFood = ko.observable("");
    self.selectFood = function(food) {
        self.selectedFood(food);
    };

    self.currentRestaurant = ko.observable(restaurantid);

    self.postNewFoodUrl = ko.computed(function() {
        return '/restaurants/' + self.currentRestaurant() + '/foods';
    });

    self.newFoodUrl = ko.computed(function() {
        return '#' + self.postNewFoodUrl() + '/new';
    });

    self.addFood = function(restaurant) {
        window.location.hash = self.newFoodUrl() + '/new';
    };

    $('#js-food-details').on('shown', function() {
        console.log('shown');
    });

    var fields = '#app-content input:not([type="submit"]):visible, textarea';
    self.initValidation(fields, {
        'description.en, description.zh, name.en, name.zh': {
            required: true
        },

        'description.en, description.zh': {
            min_length: 2
        },

        'picture': {
            need_picture: true,
            required: true
        },

        'price, memberPrice, category, unit': {
            required: true,
            need_number: true
        }
    });
}

ValidationMixin.call(FoodsViewModel.prototype);
