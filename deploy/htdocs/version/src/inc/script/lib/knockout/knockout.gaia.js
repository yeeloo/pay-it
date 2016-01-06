define(["require", "exports", 'knockout', "lib/gaia/api/Gaia", "lib/gaia/core/BranchTools", "../temple/utils/Log"], function (require, exports, ko, Gaia, BranchTools_1, Log_1) {
    var KnockoutGaiaGoto = (function () {
        function KnockoutGaiaGoto() {
        }
        KnockoutGaiaGoto.init = function (element, valueAccessor, allBindings, vm, bindingContext) {
            /**
             * Value should be:
             * - a string with the base branch, or
             * - an array with the 2 parameters for Gaia.api.goto [branch: string, deeplink: object]
             */
            var value = valueAccessor();
            var $element = $(element);
            var branch = '';
            var deeplink = {};
            if (typeof value === 'string') {
                branch = BranchTools_1.default.getValidBranch(value);
                deeplink = {};
                if (branch.length < value.length) {
                    Log_1.default.error('Temple.Knockout.GaiaGoto', 'string syntax with deeplink is not supported anymore for "' + value + '", use [branch, {}]');
                }
            }
            else {
                branch = value[0];
                deeplink = value[1];
            }
            var route = Gaia.router.assemble(branch, deeplink) || '/';
            $element.attr('href', KnockoutGaiaGoto.documentBase + route.substr(1));
            $(element).on('click', function (event) {
                event.preventDefault();
                if (typeof value === 'string') {
                    Gaia.api.goto(BranchTools_1.default.getValidBranch(value));
                }
                else {
                    Gaia.api.goto(value[0], value[1]);
                }
            });
            return {};
        };
        KnockoutGaiaGoto.documentBase = $('meta[name="document-base"]').attr('content');
        return KnockoutGaiaGoto;
    })();
    ko.bindingHandlers['gaiaGoto'] = KnockoutGaiaGoto;
    ko.virtualElements.allowedBindings['gaiaGoto'] = true;
    var KnockoutGaiaGotoRoute = (function () {
        function KnockoutGaiaGotoRoute() {
        }
        KnockoutGaiaGotoRoute.init = function (element, valueAccessor, allBindings, vm, bindingContext) {
            /**
             * Value should be:
             * - a valid route string
             */
            var value = valueAccessor();
            var $element = $(element);
            $element.attr('href', KnockoutGaiaGotoRoute.documentBase + (value.charAt(0) == '/' ? value.substr(1) : value));
            $(element).on('click', function (event) {
                event.preventDefault();
                // todo
                Gaia.api.gotoRoute(value);
            });
            return {};
        };
        KnockoutGaiaGotoRoute.documentBase = $('meta[name="document-base"]').attr('content');
        return KnockoutGaiaGotoRoute;
    })();
    ko.bindingHandlers['gaiaGotoRoute'] = KnockoutGaiaGotoRoute;
    ko.virtualElements.allowedBindings['gaiaGotoRoute'] = true;
    var KnockoutGaiaPopup = (function () {
        function KnockoutGaiaPopup() {
        }
        KnockoutGaiaPopup.init = function (element, valueAccessor, allBindings, vm, bindingContext) {
            /**
             * Value should be:
             * - a string with the popupId, or
             * - an array with the 2 parameters for Gaia.api.gotoPopup [popupId: string, deeplink: object]
             */
            var value = valueAccessor();
            var $element = $(element);
            var branch = '';
            var deeplink = {};
            if (typeof value === 'string') {
                branch = BranchTools_1.default.getPopupBranch(value, Gaia.api.getCurrentBranch());
                deeplink = {};
                if (branch.length < value.length) {
                    Log_1.default.error('Temple.Knockout.GaiaPopup', 'string syntax with deeplink is not supported anymore for "' + value + '", use [branch, {}]');
                }
            }
            else {
                branch = BranchTools_1.default.getPopupBranch(value[0], Gaia.api.getCurrentBranch());
                deeplink = value[1];
            }
            var route = Gaia.router.assemble(branch, deeplink) || '/';
            $element.attr('href', KnockoutGaiaPopup.documentBase + route.substr(1));
            $(element).on('click', function (event) {
                event.preventDefault();
                if (typeof value === 'string') {
                    Gaia.api.gotoPopup(value);
                }
                else {
                    Gaia.api.gotoPopup(value[0], value[1]);
                }
            });
            return {};
        };
        KnockoutGaiaPopup.documentBase = $('meta[name="document-base"]').attr('content');
        return KnockoutGaiaPopup;
    })();
    ko.bindingHandlers['gaiaPopup'] = KnockoutGaiaPopup;
    ko.virtualElements.allowedBindings['gaiaPopup'] = true;
});
