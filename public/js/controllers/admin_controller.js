// only admin can access this
function AdminViewModel(initial) {
    var self = this;

    var mapper = ko.utils.arrayMap;
    self.restaurants = ko.observableArray(mapper(initial.restaurants, function(res) {
        res.url = '#/restaurants/' + res._id;
        return res;
    }));

    self.displays = {
        intro: ko.observable(false),
        restaurants: ko.observable(false),
        createUser: ko.observable(false)
    };

    self.displayIt = function(res, ev) {
        var $target = $(ev.target);
        var $par = $target.parent().get(0)

        $('.affix-sidebar li').removeClass('active');
        $par.classList.add('active');

        Object.keys(self.displays).forEach(function(display) {
            self.displays[display](display === res);
        });
    };

    $('ul.affix').affix({
        offset: {
            top: '400px'
        }
    });

    // var fields = '#app-content input:not([type="submit"]):visible, textarea';
    // self.initValidation(fields, {
    //     "name.zh, name.en": {
    //         required: true
    //     },

    //     "description.en, description.zh": {
    //         min_length: 2,
    //         required: true
    //     }
    // });

}

ValidationMixin.call(AdminViewModel.prototype);
