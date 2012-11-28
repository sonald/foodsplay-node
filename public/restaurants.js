//an observable that retrieves its value when first bound
ko.onDemandObservable = function(callback, target) {
    var _value = ko.observable();  //private observable

    var result = ko.computed({
        read: function() {
            //if it has not been loaded, execute the supplied function
            if (!result.loaded()) {
                callback.call(target);
            }
            //always return the current value
            return _value();
        },
        write: function(newValue) {
            //indicate that the value is now loaded and set it
            result.loaded(true);
            _value(newValue);
        },
        deferEvaluation: true  //do not evaluate immediately when created
    });

    //expose the current state, which can be bound against
    result.loaded = ko.observable();
    //load it again
    result.refresh = function() {
        result.loaded(false);
    };

    return result;
};

$(function() {
    function Food() {
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
        this.status = ko.observable(0);
        this.inspecial = ko.observable(0);
        this.specialPrice = ko.observable(0);
        this.picture = ko.observable("");
    };

    var RestaurantViewModel = function() {
        var self = this;
        
        self.restaurants = ko.observable();
        self.currentRestaurant = ko.observable();
        self.newFood = ko.observable(new Food);
        self.newFoodUrl = ko.computed(function() {
            if (self.currentRestaurant())
                return '/restaurants/' + self.currentRestaurant()._id + '/foods';
            else
                return "";
        });
        
        self.enterRestaurant = function(restaurant) {
            window.location.hash = '#' + restaurant.url();
        };
        
        self.loadRestaurants = function() {
            window.location.hash = '#/restaurants';
        };

        self.addFood = function(restaurant) {
            window.location.hash = self.newFoodUrl() + '/new';
        };
        
        self.loadRestaurants();

        window.app = $.sammy('#app-content', function() {
            var app = this;
            
            this.get("#/restaurants", function(context) {
                $.getJSON(this.path.substring(2), function(data) {
                    data.forEach(function(ob) {
                        ob.url = ko.computed(function() {
                            return "/restaurants/" + ob._id;
                        });
                    });
                    self.restaurants( data );

                    app.$element().html( jade.compile($('#restaurants_tmpl').html())() );
                    ko.applyBindings(self, app.$element()[0]);
                });
            });

            this.get("#/restaurants/:id", function(context) {
                $.getJSON(this.path.substring(2), function(data) {
                    self.currentRestaurant(data);

                    app.$element().html( jade.compile($('#foods_tmpl').html())() );
                    ko.applyBindings(self, app.$element()[0]);
                });                
            });

            this.get("#/restaurants/:id/foods", function(context) {
            });

            this.post("#/restaurants/:id/foods", function(context) {
                console.log('post new food', this.params);
                
                $.ajax({
                    type: 'POST',
                    url: this.path.substring(2),
                    data: {
                        _csrf: this.params['_csrf'],
                        restaurantid: self.currentRestaurant()._id,
                        food: JSON.parse(ko.toJSON(self.newFood))
                    },
                    dataType: 'json',
                    success: function(data) {
                        console.log('post done', data);
                    }
                });
            });
            
            this.get("#/restaurants/:id/foods/new", function(context) {
                app.$element().html( jade.compile($('#foods_new_tmpl').html())() );
                ko.applyBindings(self, app.$element()[0]);
            });
        });

        window.app.run("#/restaurants");
    };

    window.rootModel = new RestaurantViewModel();
    
});
