function createEditable(ko_options) {
    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var opts = allBindingsAccessor().editableOptions,
                observable = valueAccessor();

            opts = opts || {};
            opts.type = opts.type || 'text';
            opts.style = opts.style || 'display: inline';
            opts.onblur = opts.onblur || 'submit';
            opts.submit = '';
            opts.tooltip = 'click to change...';
            opts.indicator = '<label class="label label-success">Saving...</label>';
            opts.url = self.postNewEmployeeUrl() + '/' + context.$data._id();
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
            // console.log('update ', value);
            $(element).html(value);
        }
    };
}
