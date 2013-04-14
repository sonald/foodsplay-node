function Employee() {
    this.name = "";
    this.role = 2;
    this.password = "";
    this.confirmed = "";
}

function EmployeesViewModel(restaurantid, initialEmployees) {
    var self = this;
    self.currentRestaurant = restaurantid;
    self.postNewEmployeeUrl = '#/restaurants/' + restaurantid + '/employees.json';

    self.newEmployee = ko.observable(new Employee);
    self.roles = [
        {name: 'manager', value: 1},
        {name: 'waiter/waitress', value: 2},
        {name: 'cook', value: 4}
    ];
    self.getRoleName = function(role) {
        console.log('query role', role);
        for (var i = 0, len = self.roles.length; i < len; ++i) {
            if (self.roles[i].value === role) {
                return self.roles[i].name;
            }
        }
        return 'invalid role';
    };

    self.employees = ko.mapping.fromJS(initialEmployees);
    var obj = {
        employees: initialEmployees.map(function(employee) {
            employee.deleteAction = function() {
                var url = '#' + self.postNewEmployeeUrl() + '/' + employee._id;
                window.app.runRoute('delete', url, {csrf: $('input[name="_csrf"]').val()});
            };
            return employee;
        })
    };
    ko.mapping.fromJS(obj, {}, self);

    ko.bindingHandlers.editable = createEditable();

    var fields = '#app-content input:not([type="submit"]):visible';
    self.initValidation(fields, {
        'name, password': {
            required: true
        }
    });
}

ValidationMixin.call(EmployeesViewModel.prototype);
