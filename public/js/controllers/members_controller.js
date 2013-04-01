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
    self.currentRestaurant = ko.observable(restaurantid);
    self.newMember = ko.mapping.fromJS(new Member);
    self.postNewMemberUrl = ko.computed(function() {
        return '/restaurants/' + self.currentRestaurant() + '/members';
    });

    self.members = ko.mapping.fromJS(initialMembers);
    var obj = {
        members: initialMembers.map(function(member) {
            member.deleteAction = function() {
                var url = '#' + self.postNewMemberUrl() + '/' + member._id;
                window.app.runRoute('delete', url, {csrf: $('input[name="_csrf"]').val()});
            };
            return member;
        })
    };
    ko.mapping.fromJS(obj, {}, self);

    self.newMemberUrl = ko.computed(function() {
        return '#' + self.postNewMemberUrl() + '/new';
    });

    self.addMember = function(restaurant) {
        window.location.hash = self.newMemberUrl();
    };

    ko.bindingHandlers.editable = createEditable();

    $('#js-member-details').on('shown', function() {
        console.log('shown');
    });

    var fields = '#app-content input:not([type="submit"]):visible';
    self.initValidation(fields, {
        'name, sex, address, icnum': {
            required: true
        },

        'cardid': {
            required: true
        }
    });
}

ValidationMixin.call(MembersViewModel.prototype);
