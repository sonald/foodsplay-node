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

            client.qrcode = ko.computed(function() {
                var cls = 'qrcode-' + client.clientId;
                return cls;
            });
            return client;
        })
    };
    ko.mapping.fromJS(obj, {}, self);

    setTimeout(function() {
        initialClients.forEach(function(client) {
            $('.qrcode-' + client.clientId).qrcode({
                width: 128, height: 128,
                text: client.appName + ':' + client.clientId + ':' + client.clientSecret
            });
        });
    }, 0);

    var fields = '#app-content input:not([type="submit"]):visible';
    self.initValidation(fields, {
        'appName': {
            required: true
        }
    });
}

ValidationMixin.call(ClientsViewModel.prototype);
