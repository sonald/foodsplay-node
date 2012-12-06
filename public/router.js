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
    window.currentModel = null;

    window.app = $.sammy('#app-content', function() {
        var app = this;
        
        this.get("#/restaurants", function(context) {
            $.getJSON(this.path.substring(2), function(data) {
                data.forEach(function(ob) {
                    ob.url = ko.computed(function() {
                        return "#/restaurants/" + ob._id;
                    });
                });

                app.$element().html( jade.compile($('#restaurants_tmpl').html())() );
                window.currentModel = new RestaurantsViewModel(data);
                ko.applyBindings(window.currentModel, app.$element()[0]);
            });
        });

        this.get("#/restaurants/:id", function(context) {
            $.getJSON(this.path.substring(2), function(data) {
                app.$element().html( jade.compile($('#restaurant_tmpl').html())() );
                window.currentModel = new RestaurantViewModel(data);
                ko.applyBindings(window.currentModel, app.$element()[0]);
            });                
        });

        this.get("#/restaurants/:id/foods", function(context) {
            var self = this;
            
            $.getJSON(this.path.substring(2), function(data) {
                app.$element().html( jade.compile($('#foods_tmpl').html())() );
                window.currentModel = new FoodsViewModel(self.params['id'], data);
                ko.applyBindings(window.currentModel, app.$element()[0]);
            });                
        });

        this.post("#/restaurants/:id/foods", function(context) {
            console.log('post new food', this.params);
            
            $.ajax({
                type: 'POST',
                url: this.path.substring(2),
                data: {
                    _csrf: this.params['_csrf'],
                    restaurantid: this.params['id'],
                    food: JSON.parse(ko.toJSON(window.currentModel.newFood()))
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

    window.app.run();
});
