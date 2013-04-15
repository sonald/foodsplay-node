function ClientsViewModel(restaurantid, initialClients) {
    var self = this;
    self.clientsUrl = '/restaurants/' + restaurantid + '/clients';
    self.postNewClientUrl = self.clientsUrl;

    self.clients = ko.mapping.fromJS(initialClients);
    var obj = {
        clients: initialClients.map(function(client) {
            client.deleteAction = function() {
                var url = '#' + self.clientsUrl + '/' + client._id;
                window.app.runRoute('delete', url, {csrf: $('input[name="_csrf"]').val()});
            };
            return client;
        })
    };
    ko.mapping.fromJS(obj, {}, self);

    var fields = '#app-content input:not([type="submit"]):visible';
    self.initValidation(fields, {
        'appName': {
            required: true
        }
    });
}

ValidationMixin.call(ClientsViewModel.prototype);
