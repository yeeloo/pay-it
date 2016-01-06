var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../api/Gaia", "../core/BranchTools", "../core/SiteModel", "../events/GaiaHistoryEvent", "lib/temple/events/EventDispatcher", "../../temple/utils/Log"], function (require, exports, Gaia, BranchTools_1, SiteModel_1, GaiaHistoryEvent_1, EventDispatcher_1, Log_1) {
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class GaiaHistory
     * @extend temple.events.EventDispatcher
     */
    var GaiaHistory = (function (_super) {
        __extends(GaiaHistory, _super);
        function GaiaHistory() {
            _super.call(this);
            this._log = new Log_1.default('lib.gaia.core.GaiaHistory');
            this._deeplink = {};
            this._history = [];
            this._historyPointer = 0;
        }
        GaiaHistory.getInstance = function () {
            if (GaiaHistory._instance == null) {
                GaiaHistory._instance = new GaiaHistory();
            }
            window['GaiaHistory'] = GaiaHistory;
            return GaiaHistory._instance;
        };
        GaiaHistory.prototype.getHistory = function () {
            return this._history;
        };
        GaiaHistory.prototype.getHistoryPointer = function () {
            return this._historyPointer;
        };
        GaiaHistory.prototype.getDeeplink = function () {
            return this._deeplink;
        };
        GaiaHistory.prototype.onGoto = function (event) {
            this._log.log('onGoto: ', event);
            if (!event.external) {
                this.isInternal = true;
                this._deeplink = event.routeResult[0].deeplink;
                this.lastValidBranch = event.routeResult[0].branch;
                // new url
                var newRoute = event.routeResult.route; // || Gaia.router.assemble(event.routeResult[0].branch, event.routeResult[0].deeplink);
                if (newRoute) {
                    // current url
                    var urlValue = Gaia.router.getRoute();
                    this._log.log('onGoto: ', urlValue, newRoute);
                    // did the url change?
                    if (newRoute != urlValue) {
                        //// and are we not dealing with an alias
                        //var currentBranchResult:IRouteResultItem = Gaia.router.resolvePage(urlValue);
                        //
                        //if (!currentBranchResult.equals(event.routeResult))
                        //{
                        // set new url
                        Gaia.router.setRoute(newRoute, event.replace);
                    }
                }
                // for normal browsers, isInternal can be set to false here
                // but in IE the change listener is async, so we get issues
                // but I let it here because it might give other issues
                this.isInternal = false;
                var title = SiteModel_1.default.getTitle().replace('{page}', Gaia.api.getPage(event.routeResult[0].branch).title);
                document.title = title;
            }
        };
        /* internal */ GaiaHistory.prototype.onChange = function (routeResult) {
            // we were in the middle
            if (this._historyPointer != 0) {
                // kill the 'forward' pages, because we create a new future
                this._history.splice(0, this._historyPointer);
                this._historyPointer = 0;
            }
            this._history.unshift(routeResult);
            if (!this.isInternal) {
                this.dispatchGoto(routeResult);
            }
            this.dispatchDeeplink(routeResult);
            // this is set here for IE
            //this.isInternal = false;
        };
        GaiaHistory.prototype.dispatchGoto = function (routeResult) {
            this.dispatchEvent(new GaiaHistoryEvent_1.default(GaiaHistoryEvent_1.default.GOTO, routeResult));
        };
        GaiaHistory.prototype.dispatchDeeplink = function (routeResult) {
            if (this.hasEventListener(GaiaHistoryEvent_1.default.DEEPLINK)) {
                this.dispatchEvent(new GaiaHistoryEvent_1.default(GaiaHistoryEvent_1.default.DEEPLINK, routeResult));
            }
        };
        GaiaHistory.prototype.back = function () {
            if (Gaia.router.config().isEnabled()) {
                history.back();
            }
            else {
                ++this._historyPointer;
                this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));
                this._internalChange();
            }
        };
        GaiaHistory.prototype.forward = function () {
            if (Gaia.router.config().isEnabled()) {
                history.forward();
            }
            else {
                --this._historyPointer;
                this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));
                this._internalChange();
            }
        };
        GaiaHistory.prototype.jump = function (steps) {
            if (Gaia.router.config().isEnabled()) {
                history.go(steps);
            }
            else {
                this._historyPointer -= steps;
                this._historyPointer = Math.max(0, Math.min(this._history.length - 1, this._historyPointer));
                this._internalChange();
            }
        };
        // untested
        GaiaHistory.prototype._internalChange = function () {
            // get validBranch from history
            var val = this._history[this._historyPointer];
            var validBranch = BranchTools_1.default.getValidBranch(val[0].branch);
            // convert validBranch to route
            if (validBranch.length > 0) {
                // todo
                //			this._deeplink = val.substring(validBranch.length);
                //			this._localValue = Gaia.api.getPage(validBranch).route.base + this._deeplink;
                // do as if the url has changed
                this.onChange(this._history[this._historyPointer]);
            }
        };
        return GaiaHistory;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaHistory;
});
