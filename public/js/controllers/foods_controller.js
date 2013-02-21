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
    self.currentRestaurant = ko.observable(restaurantid);

    self.postNewFoodUrl = ko.computed(function() {
        return '/restaurants/' + self.currentRestaurant() + '/foods';
    });

    var obj = {
        foods: initialFoods.map(function(food) {
            food.deleteAction = function() {
                var url = '#' + self.postNewFoodUrl() + '/' + food._id;
                window.app.runRoute('delete', url, {csrf: $('input[name="_csrf"]').val()});
            };

            return food;
        })
    };
    ko.mapping.fromJS(obj, {}, self);

    self.selectedFood = ko.observable("");
    self.selectFood = function(food) {
        self.selectedFood(food);
    };

    self.newFoodUrl = ko.computed(function() {
        return '#' + self.postNewFoodUrl() + '/new';
    });

    self.addFood = function(restaurant) {
        window.location.hash = self.newFoodUrl() + '/new';
    };

    self.putFoodUrl = ko.computed(function() {
        console.log('putFoodUrl: ', self.selectedFood());
        if (self.selectedFood())
            return self.postNewFoodUrl() + '/' + self.selectedFood()._id();
        else
            return "#";
    });

    self.deleteFoodUrl = ko.computed(function() {
        console.log('deleteFoodUrl: ', self.selectedFood());
        return "#" + self.putFoodUrl();
    });

    ko.bindingHandlers.editable = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var opts = allBindingsAccessor().editableOptions,
                observable = valueAccessor();

            opts = opts || {};
            opts.type = opts.type || 'text';
            opts.style = opts.style || 'display: inline';
            opts.onblur = opts.onblur || 'submit';
            opts.submit = '';
            opts.tooltip = 'click to change...';
            opts.indicator = '<label class="label label-success">Saving...</label>';
            opts.url = self.putFoodUrl();
            opts.name = $(element).data('name');
            opts.submitdata = {
                '_csrf': $('input[name="_csrf"]').val(),
                '_id': self.selectedFood()._id()
            };

            $(element).editable(function(val, settings) {
                observable(val);

                var selfobj = this;

                var submitdata = {};
                submitdata[settings.name] = val;
                $.extend(submitdata, settings.submitdata);
                submitdata['_method'] = 'put';

                /* show the saving indicator */
                $(selfobj).html(settings.indicator);

                var ajaxoptions = {
                    type    : 'POST',
                    data    : submitdata,
                    dataType: 'html',
                    url     : settings.url,
                    success : function(result, status) {
                        selfobj.editing = false;
                        $(selfobj).html(val);
                    },
                    error   : function(xhr, status, error) {
                        console.log('update error: ', error);
                    }
                };
                $.ajax(ajaxoptions);

            }, opts);

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).editable("destroy");
            });
        },

        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            console.log('update ', value);
            $(element).html(value);
        }
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
