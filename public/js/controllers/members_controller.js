function Member() {
    this.name = "";
    this.sex = "";
    this.birth = new Date();
    this.icnum = "";
    this.address = "";
    this.phone = "";
    this.mobile = "";
    this.email = "";
    this.cardid = "";
    this.kind = 0;
    this.credits = 0;
    this.history = [];
}

function MembersViewModel(restaurantid, initialMembers) {
    var self = this;
    self.members = ko.mapping.fromJS(initialMembers);
    self.currentRestaurant = ko.observable(restaurantid);

    self.newMember = ko.mapping.fromJS(new Member);

    self.postNewMemberUrl = ko.computed(function() {
        return '/restaurants/' + self.currentRestaurant() + '/members';
    });

    self.newMemberUrl = ko.computed(function() {
        return '#' + self.postNewMemberUrl() + '/new';
    });

    self.addMember = function(restaurant) {
        window.location.hash = self.newMemberUrl() + '/new';
    };

    ko.bindingHandlers.editable = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var opts = allBindingsAccessor().editableOptions,
                observable = valueAccessor();

            console.log(context);
            opts = opts || {};
            opts.type = opts.type || 'text';
            opts.style = opts.style || 'display: inline';
            opts.onblur = opts.onblur || 'submit';
            opts.submit = '';
            opts.tooltip = 'click to change...';
            opts.indicator = '<label class="label label-success">Saving...</label>';
            opts.url = self.postNewMemberUrl() + '/' + context.$data._id();
            opts.name = $(element).data('name');
            opts.submitdata = {
                '_csrf': $('input[name="_csrf"]').val(),
                '_id': context.$data._id()
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

    $('#js-member-details').on('shown', function() {
        console.log('shown');
    });

    var fields = '#app-content input:not([type="submit"]):visible, textarea';
    self.initValidation(fields, {
        'name, sex, address, icnum, cardid, kind, credits': {
            required: true
        },

        // 'cardid': {
        //     need_validcard: true
        // },

        'kind, credits': {
            need_number: true
        }
    });
}

ValidationMixin.call(MembersViewModel.prototype);
