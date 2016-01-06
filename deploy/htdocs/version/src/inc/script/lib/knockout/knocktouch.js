define(["require", "exports", 'knockout'], function (require, exports, ko) {
    //interface KnockoutBindingHandlers
    //{
    //	tap:KnockoutBindingHandler;
    //	swipeleft:KnockoutBindingHandler;
    //	swiperight:KnockoutBindingHandler;
    //	swipeup:KnockoutBindingHandler;
    //	swipedown:KnockoutBindingHandler;
    //}
    //declare module ko
    //{
    //	export var bindingHandlers:KnockoutBindingHandlers;
    //}
    ko.bindingHandlers['tap'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            $(element).on(typeof (window['ontouchstart']) != 'undefined' ? 'tap' : 'click', function (e) {
                e.preventDefault();
                valueAccessor().call(viewModel, viewModel, e);
            });
        }
    };
    ko.bindingHandlers['swipeleft'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            $(element).on('swipeleft', function (e) {
                e.preventDefault();
                valueAccessor().call(viewModel, viewModel, e);
            });
        }
    };
    ko.bindingHandlers['swiperight'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            $(element).on('swiperight', function (e) {
                e.preventDefault();
                valueAccessor().call(viewModel, viewModel, e);
            });
        }
    };
    ko.bindingHandlers['swipeup'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            $(element).on('swipeup', function (e) {
                e.preventDefault();
                valueAccessor().call(viewModel, viewModel, e);
            });
        }
    };
    ko.bindingHandlers['swipedown'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            $(element).on('swipedown', function (e) {
                e.preventDefault();
                valueAccessor().call(viewModel, viewModel, e);
            });
        }
    };
    var knocktouch = (function () {
        function knocktouch() {
            this.fool = 0;
        }
        return knocktouch;
    })();
    exports.knocktouch = knocktouch;
});
