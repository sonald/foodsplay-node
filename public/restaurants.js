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
    var RestaurantViewModel = function() {
        var self = this;
        
        self.restaurants = ko.observable();
        self.currentRestaurant = ko.observable();

        self.enterRestaurant = function(restaurant) {
            window.location.hash = '#' + restaurant.url();
        };
        
        self.loadRestaurants = function() {
            window.location.hash = '#/restaurants';
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
                var app = this;
                
                $.getJSON(this.path.substring(2), function(data) {
                    self.currentRestaurant(data);

                    app.$element().html( jade.compile($('#foods_tmpl').html())() );
                    ko.applyBindings(self, app.$element()[0]);
                });                
            });
        });

        window.app.run("#/restaurants");
    };

    window.rootModel = new RestaurantViewModel();
    
});
