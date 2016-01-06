//import * as Gaia from "lib/gaia/api/Gaia";
//import BranchTools from "lib/gaia/core/BranchTools";
//import SiteModel from "lib/gaia/core/SiteModel";
define(["require", "exports", "lib/gaia/router/GaiaRouterConfig", "lib/gaia/router/GaiaRouteGroup", "lib/gaia/router/RouteResultItem", "../../temple/utils/Log"], function (require, exports, GaiaRouterConfig_1, GaiaRouteGroup_1, RouteResultItem_1, Log_1) {
    /**
     * @namespace gaia.router
     * @class GaiaRouter
     */
    var GaiaRouter = (function () {
        /**
         * @class GaiaRouter
         * @constructor
         * @param gaiaHistory [IGaiaHistory]
         */
        function GaiaRouter(gaiaHistory) {
            var _this = this;
            this._localValue = '';
            /**
             * Bind the popstate event listener
             *
             * @private
             * @method bindPopstateListener
             * @param {event} event
             */
            this.bindPopstateListener = function (event) {
                // Temporary method that binds the popstate event
                var bindPopstate = function () {
                    window.addEventListener('popstate', function () {
                        _this.notifyHistory(_this.getRoute());
                    });
                };
                if (event) {
                    // Remove load event
                    window.removeEventListener('load', _this.bindPopstateListener);
                    // Bind popstate event at the end of the call stack
                    setTimeout(function () {
                        bindPopstate();
                        bindPopstate = null;
                    }, 0);
                }
                else {
                    // Bind popstate event
                    bindPopstate();
                    bindPopstate = null;
                }
            };
            this._gaiaHistory = gaiaHistory;
            this._config = new GaiaRouterConfig_1.default();
            this._group = new GaiaRouteGroup_1.default(this._config);
        }
        /**
         * @public
         * @method config
         * @returns {gaia.router.GaiaRouterConfig}
         */
        GaiaRouter.prototype.config = function () {
            return this._config;
        };
        /**
         * Init GaiaRouter
         *
         * @public
         * @method init
         */
        GaiaRouter.prototype.init = function () {
            var base = document.querySelector('meta[name="document-base"]');
            this._base = base !== null ? base.getAttribute('content') : null;
            // not defined, set root of domain
            if (this._base === null) {
                this._base = document.location.protocol + '//' + document.location.host + '/';
            }
            else if (this._base.indexOf(document.location.host) == -1) {
                this._base = document.location.protocol + '//' + document.location.host + (this._base.charAt(0) == '/' ? '' : '/') + this._base;
            }
            // force trailing /
            if (this._base.split('').pop() != '/') {
                this._base += '/';
            }
            if (this._config.isEnabled()) {
                // get path for emulated redirect
                history['redirect'] && history['redirect']('/', this._base.replace(document.location.protocol + '//' + document.location.host, ''));
            }
            // this will retrieve the locale from the url
            this.getHistoryValue();
            // todo Async change route in start
            // If load event is already dispatched add popstate listener
            if (document.readyState === 'complete') {
                this.bindPopstateListener();
            }
            else {
                window.addEventListener('load', this.bindPopstateListener);
            }
        };
        /**
         * @public
         * @method start
         */
        GaiaRouter.prototype.start = function () {
            this.notifyHistory(this.getRoute(), true);
        };
        /**
         * Return locale
         *
         * @public
         * @method getLocale
         * @return {string} locale
         */
        GaiaRouter.prototype.getLocale = function () {
            return this._locale || this._config.getDefaultLocale();
        };
        /**
         * Set locale
         *
         * @public
         * @method setLocale
         * @param {string} locale
         */
        GaiaRouter.prototype.setLocale = function (locale) {
            this._locale = locale;
            this.setHistoryValue(this.getHistoryValue(true));
        };
        /**
         * Return the current route
         *
         * @public
         * @method getRoute
         * @returns {string} Current route
         */
        GaiaRouter.prototype.getRoute = function () {
            return this.getHistoryValue();
        };
        /**
         * Set current route; Set replace if you want to replace the current route in history.
         *
         * @public
         * @method setRoute
         * @param {string} route
         * @param {boolean} [replace=false]
         */
        GaiaRouter.prototype.setRoute = function (route, replace) {
            //if (DEBUG) console.log('[GaiaRouter] setRoute: ', route, replace);
            if (replace === void 0) { replace = false; }
            this.setHistoryValue(route, replace);
            this.notifyHistory(route);
        };
        /**
         * Returns a query parameter, the part after the `?`
         *
         * @public
         * @method getQueryParam
         * @param {string} key
         * @returns {string}
         */
        GaiaRouter.prototype.getQueryParam = function (key) {
            return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        };
        /**
         * Add a branch that functions as 404
         *
         * @public
         * @method notFound
         * @param {string} branch
         * @returns {GaiaRouter}
         */
        GaiaRouter.prototype.notFound = function (branch) {
            this._notFound = branch;
            return this;
        };
        /**
         * Redirect route
         *
         * @public
         * @method redirect
         * @param {string} route
         * @param {string} redirect
         */
        GaiaRouter.prototype.redirect = function (route, redirect) {
            return this._group.redirect(route, redirect);
        };
        /**
         * Add a callback when a route gets resolved
         *
         * @public
         * @method handle
         * @param {string} route
         * @param {function} callback
         */
        GaiaRouter.prototype.handle = function (route, callback) {
            return this._group.handle(route, callback);
        };
        /**
         * @public
         * @method page
         * @param {string} route
         * @param {string} page
         */
        GaiaRouter.prototype.page = function (route, branch) {
            return this._group.page(route, branch);
        };
        /**
         * Add an alias for a route
         *
         * @public
         * @method alias
         * @param {string} route
         * @param {string} branch
         */
        GaiaRouter.prototype.alias = function (route, branch) {
            return this._group.alias(route, branch);
        };
        /**
         * @public
         * @method childPage
         * @param {string} route
         * @param {string} branch
         */
        GaiaRouter.prototype.childPage = function (route, branch) {
            return this._group.childPage(route, branch);
        };
        //    public resolve(url:string):IRouteResultItem
        //    {
        //        console.log('resolve: ', url);
        //
        //        for (var i = 0; i < this._routeActions.length; i++)
        //        {
        //            var routeAction = this._routeActions[i];
        //
        //            if (routeAction.route.isMatch(url))
        //            {
        ////                console.log('matched : ', routeAction.route);
        //
        //                if (routeAction.type == RouteAction.REDIRECT)
        //                {
        //                    // re-feed the redirect route to the resolver
        //                    return this.resolve(routeAction.execute(url));
        //                }
        //                else
        //                {
        //                    return routeAction.execute(url);
        //                }
        //            }
        //
        //        }
        //
        //        if (this._notFound)
        //        {
        //            // todo: goto 404 route
        //            return [{branch: this._notFound, deeplink: {}}];
        //        }
        //        else
        //        {
        //            // todo: goto home
        //            return [{branch: 'index', deeplink: {}}];
        //        }
        //    }
        /**
         * @public
         * @method resolvePage
         * @param {string} url
         * @param {function} callback
         * @param {boolean} [includeRedirects=false]
         * @param {boolean} [isLanding=false]
         */
        GaiaRouter.prototype.resolvePage = function (url, callback, includeRedirects, isLanding) {
            var _this = this;
            if (includeRedirects === void 0) { includeRedirects = false; }
            if (isLanding === void 0) { isLanding = false; }
            var i;
            if (!this._config.isQueryStringIncluded() && (i = url.indexOf('?')) != -1)
                url = url.substr(0, i);
            this._group.resolvePage(url, function (routeResult) {
                if (routeResult.length > 0) {
                    callback(routeResult);
                    return;
                }
                if (_this._notFound) {
                    // todo: goto 404 route
                    callback(new RouteResultItem_1.default([{ branch: _this._notFound, deeplink: {} }], url));
                }
                else {
                    Log_1.default.info('Gaia.Router.GaiaRouter', 'no route found for "' + url + '", redirecting to index!');
                    // todo: goto home
                    callback(new RouteResultItem_1.default([{ branch: 'index', deeplink: {} }], url));
                }
            }, includeRedirects, isLanding);
        };
        /**
         * @public
         * @method assemble
         * @param {string} branch
         * @param {any} params
         */
        GaiaRouter.prototype.assemble = function (branch, params) {
            if (params === void 0) { params = {}; }
            var route = this._group.getRoute(branch, params);
            return route ? route.assemble(params) : null;
        };
        /**
         * @public
         * @method getGroup
         * @return {gaia.router.GaiaRouteGroup}
         */
        GaiaRouter.prototype.getGroup = function () {
            return this._group;
        };
        /**
         * @private
         * @method notifyHistory
         * @param {string} route
         * @param {boolean} [isLanding=false]
         */
        GaiaRouter.prototype.notifyHistory = function (route, isLanding) {
            var _this = this;
            if (isLanding === void 0) { isLanding = false; }
            //if (DEBUG) console.log('[GaiaRouter] notifyHistory: ', route);
            this.resolvePage(route, function (routeResult) {
                //if (DEBUG) console.log(' - ', routeResult);
                Object.freeze(routeResult[0].deeplink);
                // check for redirects on landing, and do a replaceState
                if (routeResult.route != route && isLanding) {
                    //console.log('- redirect!');
                    _this.setHistoryValue(routeResult.route, true);
                }
                _this._gaiaHistory.onChange(routeResult);
            }, true, isLanding);
        };
        /**
         * @private
         * @method getHistoryValue
         * @param {boolean} [skipLocale=false]
         * @param {boolean} [ignoreEnabledState=false]
         * @return {string} route
         */
        GaiaRouter.prototype.getHistoryValue = function (skipLocale, ignoreEnabledState) {
            if (skipLocale === void 0) { skipLocale = false; }
            if (ignoreEnabledState === void 0) { ignoreEnabledState = false; }
            if (!this._config.isEnabled() && !ignoreEnabledState) {
                return this._localValue;
            }
            // fix for weird IE version
            var location = (history['location'] || document.location).href || document.location.href;
            this._queryString = document.location.search;
            // force trailing /
            if (location.split('').pop() != '/') {
                location += '/';
            }
            // prevent future errors
            if (location == undefined || location == null) {
                location = '';
            }
            // strip basepath, leave deeplink
            if (location.indexOf(this._base) == 0) {
                location = location.replace(this._base, '');
            }
            // force starting /
            if (location.charAt(0) != '/') {
                location = '/' + location;
            }
            // remove trailing /
            if (location.split('').pop() == '/') {
                location = location.substr(0, location.length - 1);
            }
            // locale hook
            if (!skipLocale) {
                var locale = this._config.getLocaleRegExp().exec(location);
                if (locale) {
                    this._locale = locale[1];
                }
            }
            location = location.replace(this._config.getLocaleRegExp(), '');
            // end locale hook
            // force starting /
            if (location.charAt(0) != '/') {
                location = '/' + location;
            }
            //console.log('[GaiaRouter] getHistoryValue: ', location);
            return location;
        };
        /**
         * @private
         * @method setHistoryValue
         * @param {string} value
         * @param {boolean} [replace=false]
         */
        GaiaRouter.prototype.setHistoryValue = function (value, replace) {
            //console.log('[GaiaRouter] setHistoryValue: ', value, replace);
            if (replace === void 0) { replace = false; }
            if (!this._config.isEnabled()) {
                this._localValue = value;
                return;
            }
            // absolute
            if (value.charAt(0) == '/') {
                // chrome
                if (!history['emulate']) {
                    value = value.substr(1);
                }
            }
            else {
                // chrome
                if (!history['emulate']) {
                    value = (this.getHistoryValue(true).replace(/[^\/]+$/g, '') + value).substr(1);
                }
            }
            // absolute
            if (value.charAt(0) == '/') {
                // locale hook
                value = (this._locale ? '/' + this._locale : '') + value;
            }
            else {
                // locale hook
                value = (this._locale ? this._locale + '/' : '') + value;
            }
            if (this._queryString.length > 0) {
                value += this._queryString;
            }
            if (!history['emulate']) {
                history[replace ? 'replaceState' : 'pushState'](null, null, this._base + (value.charAt(0) == '/' ? value.substr(0) : value));
            }
            else {
                history[replace ? 'replaceState' : 'pushState'](null, null, value);
            }
        };
        return GaiaRouter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaRouter;
});
