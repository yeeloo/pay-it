define(["require", "exports", 'knockout', "lib/temple/utils/types/StringUtils"], function (require, exports, ko, StringUtils_1) {
    var KnockoutComponent = (function () {
        function KnockoutComponent() {
        }
        KnockoutComponent.init = function (element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var componentId;
            var componentIdCamelCase;
            var componentBaseDir;
            var options;
            var callback;
            var rootViewModel;
            var path = '';
            var $element = $(element);
            // if applyBinding is called from the component, it will try to create a new instance
            // so skip if we already have a component
            if (typeof $element.data('component_loading') !== 'undefined' || typeof $element.data('component') !== 'undefined') {
                return;
            }
            // parse 2 different types
            // basic string with ID
            if (typeof value === 'string') {
                componentId = value;
            }
            else {
                componentId = value.name;
                if (value.root) {
                    rootViewModel = value.root;
                }
                if (value.options) {
                    options = value.options;
                }
                if (value.onReady) {
                    callback = value.onReady;
                }
            }
            if (!rootViewModel) {
                rootViewModel = ko.contextFor(element).$root;
            }
            componentIdCamelCase = StringUtils_1.default.camelCase(componentId);
            if (componentId.split('/').length > 1) {
                var parts = componentId.split('/');
                componentId = parts.pop();
                componentIdCamelCase = StringUtils_1.default.camelCase(componentId);
                path = parts.join('/') + '/';
            }
            componentBaseDir = KnockoutComponent.baseDir + path + componentId + '/';
            require([
                componentBaseDir + componentIdCamelCase + 'Bundle'
            ], function (bundle) {
                var controller = bundle.controller;
                var viewModel = bundle.viewmodel;
                var template = bundle.template;
                var vmInstance = new (viewModel)();
                var controllerInstance = new (controller)(element, options || {});
                controllerInstance.setViewModel(vmInstance);
                controllerInstance.setTemplate(template);
                var disposeCallback = function () {
                    ko.utils.domNodeDisposal.removeDisposeCallback(controllerInstance.element, disposeCallback);
                    controllerInstance.destruct();
                };
                ko.utils.domNodeDisposal.addDisposeCallback(controllerInstance.element, disposeCallback);
                controllerInstance.init();
                if (typeof callback != 'undefined') {
                    callback(controllerInstance);
                }
            });
            return { controlsDescendantBindings: true };
        };
        KnockoutComponent.baseDir = 'app/component/';
        return KnockoutComponent;
    })();
    ko.bindingHandlers['component'] = KnockoutComponent;
    ko.virtualElements.allowedBindings['component'] = true;
});
