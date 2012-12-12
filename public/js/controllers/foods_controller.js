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

    self.newFoodValid = ko.computed(function() {
        return self.newFood().name.zh().trim().length > 0;
    });
}
