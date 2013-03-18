function MetasViewModel(restaurantid, initMetas) {
    var self = this;
    self.newMeta = ko.mapping.fromJS({
        name: {
            zh: '',
            en: ''
        },
        floor: 1,
        kind: ''
    });

    self.currentRestaurant = ko.observable(restaurantid);

    self.postNewMetaUrl = ko.computed(function() {
        return '/restaurants/' + self.currentRestaurant() + '/metas';
    });

    self.metas = ko.mapping.fromJS(initMetas);

    self.newMetaUrl = ko.computed(function() {
        return '#' + self.postNewMetaUrl() + '/new';
    });

    var fields = '#app-content input:not([type="submit"]):visible';
    self.initValidation(fields, {
        'name.en, name.zh': {
            required: true
        }
    });

    self.kinds = ko.observableArray([
        {
            id: 'table',
            display: 'Table'
        }, {
            id: 'category',
            display: 'Category'
        }, {
            id: 'unit',
            display: 'Food Unit'
        }, {
            id: 'flavor',
            display: 'Food Flavor'
        }]);

    self.newMetaIsTable = ko.observable();
    self.selectedKind = ko.observable();
    self.selectedKind.subscribe(function(val) {
        console.log('new kind', val);
        self.newMetaIsTable(self.selectedKind() == 'table');
    });
}

ValidationMixin.call(MetasViewModel.prototype);
