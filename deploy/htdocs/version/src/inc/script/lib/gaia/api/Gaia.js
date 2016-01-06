define(["require", "exports", "../core/GaiaHQ", "../core/GaiaHistory", "../router/GaiaRouter", "../core/SiteModel", "../core/SiteController", "../core/BranchTools", "../events/GaiaEvent", "../router/RouteResultItem", "../events/GaiaHistoryEvent", "../events/PageEvent", "../../temple/utils/Log"], function (require, exports, GaiaHQ_1, GaiaHistory_1, GaiaRouter_1, SiteModel_1, SiteController_1, BranchTools_1, GaiaEvent_1, RouteResultItem_1, GaiaHistoryEvent_1, PageEvent_1, Log_1) {
    /**
     *
     * @moduleDocumentation ../../../doc/module/Gaia.md
     * @module Gaia
     * @namespace gaia.api
     * @class GaiaImpl
     */
    var GaiaImpl = (function () {
        function GaiaImpl() {
            this._log = new Log_1.default('lib.gaia.api.Gaia');
        }
        /**
         * goto is the primary method you will be using in Gaia. It requires at least one argument and that is a string of the branch you want to navigate to.
         *
         * It has support for absolute paths, starting with a `/`, or relative paths. You can also use `./` or `../` to go a level up.<br>
         * The starting `/` is optional<br>
         * Starting with a `.` makes it relative<br>
         *
         * Starting with `index/home/detail`
         *
         *	index/foo        >> index/foo
         *	/index/foo       >> index/foo
         *	.                >> index/home/detail
         *	./foo            >> index/home/detail/foo
         *	..               >> index/home
         *	../foo           >> index/home/foo
         *
         * __Note:__<br>
         * If you are doing a goto to a sub- or parent-page and want to keep url-parameters of your current/parent page in tact, you should use
         *
         *	$.extend({}, Gaia.api.getDeeplink(), {foo: bar})
         *
         * to merge the current and new deeplink together and pass them as the deeplink parameter.
         *
         * @method goto
         * @param {string} branch
         * @param {HashMap} [deeplink]
         * @param {boolean} [replace=false]
         */
        GaiaImpl.prototype.goto = function (branch, deeplink, flow, replace) {
            if (flow === void 0) { flow = null; }
            if (replace === void 0) { replace = false; }
            if (!branch)
                throw new Error("branch can not be empty");
            var branch = BranchTools_1.default.resolveBranch(branch, this.getCurrentBranch());
            var routeResult = new RouteResultItem_1.default([{
                    branch: branch,
                    deeplink: deeplink
                }], exports.router.assemble(branch, deeplink));
            GaiaHQ_1.default.getInstance().goto(routeResult, flow, null, replace);
        };
        /**
         * Opens a new page by providing the route.
         *
         * @method gotoRoute
         * @param {string} route
         */
        GaiaImpl.prototype.gotoRoute = function (route, replace) {
            var _this = this;
            if (replace === void 0) { replace = false; }
            // add accidental missing starting /
            if (route.charAt(0) != '/') {
                route = route + '/';
            }
            // transform route into branch
            exports.router.resolvePage(route, function (routeResult) {
                if (routeResult) {
                    GaiaHQ_1.default.getInstance().goto(routeResult, null, null, replace);
                }
                else {
                    routeResult = new RouteResultItem_1.default([{
                            branch: 'index',
                            deeplink: {}
                        }], exports.router.assemble('index'));
                    _this._log.error('gotoRoute: invalid route ', route);
                    GaiaHQ_1.default.getInstance().goto(routeResult);
                }
            }, true, false);
        };
        /**
         * Proxy method for a normal goto, but from the current page.
         *
         * @method gotoDeeplink
         * @param {HashMap} [deeplink]
         * @param {boolean} [replace=false]
         */
        GaiaImpl.prototype.gotoDeeplink = function (deeplink, replace) {
            if (replace === void 0) { replace = false; }
            this.goto(this.getCurrentBranch(), deeplink, null, replace);
        };
        /**
         * Navigates to a popup relative from the current base-branch.<br>
         * Popups are normal pages that are dynamically appended as subpages to all other pages.<br>
         * You navigate to popups using the branch-path of only the popup.<br>
         * So if you are on /index/home, and you want to open the about popup you do:
         *
         *	Gaia.api.gotoPopup('about');
         *
         * If you have a popup-wrapper named 'popup' the goto will be:
         *
         *	Gaia.api.gotoPopup('popup/about');
         *
         * Opening a new popup will automatically close other opened popups.
         *
         * Because opening a popup is almost always a sub-page (except when closing a current one),
         * it will automatically merge the passed deeplink over the current deeplink, keeping it in tact.
         *
         * @method gotoPopup
         * @param {string} popupId the 'branch-path' of the popup part of the branch, will be appended to the current branch
         * @param {HashMap} [deeplink]
         */
        GaiaImpl.prototype.gotoPopup = function (popupId, deeplink, replace) {
            var branch = BranchTools_1.default.getPopupBranch(popupId, this.getCurrentBranch());
            // merge new deeplink over current one
            deeplink = $.extend({}, this.getDeeplink(), deeplink);
            this.goto(branch, deeplink, null, replace);
        };
        /**
         * Closes the currently opened popup.
         * It will also automatically keep the current deeplink, alowing the parent page to keep working.
         *
         * @method closePopup
         */
        GaiaImpl.prototype.closePopup = function () {
            this.gotoPopup(null, this.getDeeplink());
        };
        /**
         * Returns the current branch.
         *
         * @method getCurrentBranch
         * @returns {string}
         */
        GaiaImpl.prototype.getCurrentBranch = function () {
            return SiteController_1.default.getCurrentBranch();
        };
        /**
         * Returns the current route.
         *
         * @method getCurrentRoute
         * @returns {string}
         */
        GaiaImpl.prototype.getCurrentRoute = function () {
            return SiteController_1.default.getCurrentRoute();
        };
        /**
         * Returns the current deeplink.
         *
         * The deeplink is an object filled with all the deeplink parameters.<br>
         * To get an individual parameter you can use {{#crossLink "gaia.api.GaiaImpl/getParam:method"}}{{/crossLink}}
         *
         * @method getDeeplink
         * @returns {HashMap}
         */
        GaiaImpl.prototype.getDeeplink = function () {
            return GaiaHistory_1.default.getInstance().getDeeplink();
        };
        /**
         * Returns the current route.
         *
         * Proxy function for {{#crossLink "gaia.router.GaiaRouter/getRoute:method"}}{{/crossLink}}
         *
         * @method getRoute
         * @returns {string}
         */
        GaiaImpl.prototype.getRoute = function () {
            return exports.router.getRoute();
        };
        /**
         * Returns a single deeplink param.
         *
         * @method getParam
         * @param {string} [key]
         * @returns {*}
         */
        GaiaImpl.prototype.getParam = function (key) {
            if (key === void 0) { key = null; }
            var dl = this.getDeeplink();
            if (dl == null || key == null) {
                return dl;
            }
            if (dl.hasOwnProperty(key)) {
                return dl[key];
            }
            else {
                return null;
            }
        };
        /**
         * Returns the valid branch from the input, stripping off all invalid parts of the link at the end.
         *
         * @method getValidBranch
         * @param {string} branch
         * @returns {string}
         */
        GaiaImpl.prototype.getValidBranch = function (branch) {
            return BranchTools_1.default.getValidBranch(branch);
        };
        /**
         * Returns the PageAsset from the given branch, giving access to data from the sitemap and the page Controller.
         *
         * @method getPage
         * @param {string} branch
         * @returns {IPageAsset}
         */
        GaiaImpl.prototype.getPage = function (branch) {
            return BranchTools_1.default.getPage(branch);
        };
        GaiaImpl.prototype.getDepthContainer = function (name) {
            return null;
        };
        /**
         * Goes back to the previous page, either by using the Browsers history, or checking internally.
         * @method back
         */
        GaiaImpl.prototype.back = function () {
            GaiaHistory_1.default.getInstance().back();
        };
        /**
         * Goes forward to the next page, either by using the Browsers history, or checking internally.
         * @method forward
         */
        GaiaImpl.prototype.forward = function () {
            GaiaHistory_1.default.getInstance().forward();
        };
        /**
         * Jumps x steps in the history, either by using the Browsers history, or checking internally.
         * @method jump
         */
        GaiaImpl.prototype.jump = function (steps) {
            GaiaHistory_1.default.getInstance().jump(steps);
        };
        // goto
        GaiaImpl.prototype.beforeGoto = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.BEFORE_GOTO, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterGoto = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.AFTER_GOTO, target, hijack, onlyOnce);
        };
        // out
        GaiaImpl.prototype.beforeTransitionOut = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.BEFORE_TRANSITION_OUT, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterTransitionOut = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.AFTER_TRANSITION_OUT, target, hijack, onlyOnce);
        };
        // in
        GaiaImpl.prototype.beforeTransitionIn = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.BEFORE_TRANSITION_IN, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterTransitionIn = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.AFTER_TRANSITION_IN, target, hijack, onlyOnce);
        };
        // trans
        GaiaImpl.prototype.beforeTransition = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.BEFORE_TRANSITION, target, hijack, onlyOnce);
        };
        GaiaImpl.prototype.afterTransition = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.AFTER_TRANSITION, target, hijack, onlyOnce);
        };
        // complete
        GaiaImpl.prototype.afterComplete = function (target, hijack, onlyOnce) {
            if (hijack === void 0) { hijack = false; }
            if (onlyOnce === void 0) { onlyOnce = false; }
            return GaiaHQ_1.default.getInstance().addListener(GaiaEvent_1.default.AFTER_COMPLETE, target, hijack, onlyOnce);
        };
        // goto
        GaiaImpl.prototype.removeBeforeGoto = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.BEFORE_GOTO, target);
        };
        GaiaImpl.prototype.removeAfterGoto = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.AFTER_GOTO, target);
        };
        // out
        GaiaImpl.prototype.removeBeforeTransitionOut = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.BEFORE_TRANSITION_OUT, target);
        };
        GaiaImpl.prototype.removeAfterTransitionOut = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.AFTER_TRANSITION_OUT, target);
        };
        // in
        GaiaImpl.prototype.removeBeforeTransitionIn = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.BEFORE_TRANSITION_IN, target);
        };
        GaiaImpl.prototype.removeAfterTransitionIn = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.AFTER_TRANSITION_IN, target);
        };
        // trans
        GaiaImpl.prototype.removeBeforeTransition = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.BEFORE_TRANSITION, target);
        };
        GaiaImpl.prototype.removeAfterTransition = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.AFTER_TRANSITION, target);
        };
        // complete
        GaiaImpl.prototype.removeAfterComplete = function (target) {
            GaiaHQ_1.default.getInstance().removeListener(GaiaEvent_1.default.AFTER_COMPLETE, target);
        };
        GaiaImpl.prototype.addDeeplinkListener = function (target) {
            return GaiaHistory_1.default.getInstance().addEventListener(GaiaHistoryEvent_1.default.DEEPLINK, target);
        };
        GaiaImpl.prototype.removeDeeplinkListener = function (target) {
            GaiaHistory_1.default.getInstance().removeEventListener(GaiaHistoryEvent_1.default.DEEPLINK, target);
        };
        GaiaImpl.prototype.addPageInitListener = function (handler) {
            return GaiaHQ_1.default.getInstance().addEventListener(PageEvent_1.default.BEFORE_INIT, handler);
        };
        GaiaImpl.prototype.removePageInitListener = function (handler) {
            GaiaHQ_1.default.getInstance().removeEventListener(PageEvent_1.default.BEFORE_INIT, handler);
        };
        /**
         * Check of Gaia is ready.
         *
         * @method isReady
         * @returns {boolean}
         */
        GaiaImpl.prototype.isReady = function () {
            return !!SiteController_1.default.getCurrentBranch();
        };
        GaiaImpl.prototype.getDefaultFlow = function () {
            return SiteModel_1.default.defaultFlow;
        };
        GaiaImpl.prototype.setDefaultFlow = function (flow) {
            SiteModel_1.default.defaultFlow = flow;
        };
        return GaiaImpl;
    })();
    /**
     * @namespace gaia.api
     * @class api
     */
    exports.api = new GaiaImpl();
    /**
     * @namespace gaia.api
     * @class history
     * @type GaiaHistory
     */
    exports.history = GaiaHistory_1.default.getInstance();
    /**
     * @namespace gaia.api
     * @class hq
     * @type GaiaImpl
     */
    exports.hq = GaiaHQ_1.default.getInstance();
    /**
     * @namespace gaia.api
     * @property router
     * @type gaia.router.GaiaRouter
     */
    exports.router = new GaiaRouter_1.default(GaiaHistory_1.default.getInstance());
});
