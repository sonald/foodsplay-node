var ValidationMixin = (function() {
    function validate() {
        var self = this;

        if (self.validator) {
            var result = self.validator.runValidations();
            console.log(result);
            if (!result.valid) {
                self.validationErrors(result.messages.join(",").trim());
            }
            return result.valid;
        }
        return true;
    };

    function initValidation(fields, schemas) {
        var self = this;
        self.fields = fields;
        self.schemas = schemas;
    };

    function setupValidation() {
        var self = this;
        var vd = self.validator = FormValidator($(self.fields));
        console.log(self.fields);

        vd.addValidationMethod("need_picture", function(val) {
            var suffix = val.match( /\.\w+$/ );
            return suffix && ['.png', '.jpg', '.tiff'].indexOf(suffix[0]) != -1;
        }, "Field %F needs a picture type");

        vd.addValidationMethod("need_number", function(val) {
            var r = Number(val);
            return val && !isNaN(r);
        }, "Field %F needs a valid number");

        Object.keys(self.schemas).forEach(function(obj) {
            var fields = obj.split(',').map(Function.prototype.call, String.prototype.trim);
            var schema = self.schemas[obj];
            fields.forEach(function(field) {
                vd.addValidation(field, schema);
            });
        });
    };

    return function() {
        this.validationErrors = ko.observable("");
        this.initValidation = initValidation;
        this.setupValidation = setupValidation;
        this.validate = validate;
        return this;
    };
})();
