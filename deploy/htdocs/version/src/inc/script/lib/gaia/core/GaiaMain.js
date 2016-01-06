define(["require", "exports", "../api/Gaia", "../core/SiteModel", "../core/SiteController", "../core/SiteView", "../core/GaiaHQ", "../events/GaiaEvent", "../events/GaiaHistoryEvent", "../events/PageEvent", "app/util/Analytics"], function (require, exports, Gaia, SiteModel_1, SiteController_1, SiteView_1, GaiaHQ_1, GaiaEvent_1, GaiaHistoryEvent_1, PageEvent_1, ga) {
    window['Gaia'] = Gaia;
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class GaiaMain
     */
    var GaiaMain = (function () {
        function GaiaMain() {
        }
        /**
         * @method startGaia
         * @param {?} siteConfig
         * @return {void}
         */
        GaiaMain.prototype.startGaia = function (sitemap) {
            this._model = new SiteModel_1.default();
            this._model.load(sitemap);
            this._controller = new SiteController_1.default(new SiteView_1.default());
            GaiaHQ_1.default.birth();
            var gaiaHQ = GaiaHQ_1.default.getInstance();
            // lower prio than GaiaHistory listener
            gaiaHQ.addEventListener(GaiaEvent_1.default.GOTO, this._controller.onGoto.bind(this._controller));
            gaiaHQ.addEventListener(GaiaHQ_1.default.TRANSITION_OUT, this._controller.onTransitionOut.bind(this._controller));
            gaiaHQ.addEventListener(GaiaHQ_1.default.TRANSITION_IN, this._controller.onTransitionIn.bind(this._controller));
            gaiaHQ.addEventListener(GaiaHQ_1.default.TRANSITION, this._controller.onTransition.bind(this._controller));
            gaiaHQ.addEventListener(GaiaHQ_1.default.PRELOAD, this._controller.onPreload.bind(this._controller));
            gaiaHQ.addEventListener(GaiaHQ_1.default.COMPLETE, this._controller.onComplete.bind(this._controller));
            this._controller.addEventListener(PageEvent_1.default.BEFORE_INIT, gaiaHQ.dispatchEvent.bind(gaiaHQ));
            this.onInit();
        };
        GaiaMain.prototype.onInit = function () {
            ga.enableGaiaTracking(Gaia.api, Gaia.router);
            var hq = GaiaHQ_1.default.getInstance();
            // higher prio than own HQ listener
            hq.addEventListener(GaiaEvent_1.default.GOTO, Gaia.history.onGoto.bind(Gaia.history), 1);
            Gaia.history.addEventListener(GaiaHistoryEvent_1.default.GOTO, hq.onGoto.bind(hq));
            Gaia.router.start();
            // gaia-goto bindings
            $('body')
                .on('tap', '[data-gaia-popup-close]', function (event) {
                // close popups
                event.preventDefault();
                Gaia.api.closePopup();
            })
                .on('tap', 'a[href]', function (event) {
                // check for internal links and pass them to Gaia
                var target = $(event.currentTarget);
                // check requirements:
                // - check for self target
                // - check for other gaia actions
                // - check for url-match
                if ((!target.attr('target') || target.attr('target') == '_self') &&
                    !target.attr('data-gaia-goto') &&
                    !target.attr('data-gaia-popup') &&
                    !target.attr('data-gaia-goto-route') &&
                    !target.attr('data-gaia-popup-close') &&
                    target.attr('href').indexOf($('meta[name="document-base"]').attr('content')) != -1) {
                    event.preventDefault();
                    // get route from URL
                    var fullRoute = (target.attr('href').match(new RegExp($('meta[name="document-base"]').attr('content') + '(.*)', 'i')))[1];
                }
            });
        };
        return GaiaMain;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaMain;
});
