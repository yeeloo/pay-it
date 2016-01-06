define(["require", "exports", "lib/gaia/router/GaiaRoute", "lib/gaia/router/RouteResultItem", "../../temple/utils/Log"], function (require, exports, GaiaRoute_1, RouteResultItem_1, Log_1) {
    /**
     * @namespace gaia.router
     * @class GaiaRouteGroup
     */
    var GaiaRouteGroup = (function () {
        function GaiaRouteGroup(config) {
            this._routes = [];
            this._log = new Log_1.default('lib.gaia.router.GaiaRouteGroup');
            this._config = config;
        }
        GaiaRouteGroup.prototype.redirect = function (route, redirect) {
            return this.addRoute(new GaiaRoute_1.default(route, new RedirectAction(redirect)));
        };
        GaiaRouteGroup.prototype.handle = function (route, callback) {
            return this.addRoute(new GaiaRoute_1.default(route, new HandleAction(callback)));
        };
        GaiaRouteGroup.prototype.page = function (route, branch) {
            return this.addRoute(new GaiaRoute_1.default(route, new PageAction(branch)));
        };
        GaiaRouteGroup.prototype.alias = function (route, branch) {
            return this.addRoute(new GaiaRoute_1.default(route, new PageAction(branch, RouteAction.ALIAS)));
        };
        GaiaRouteGroup.prototype.childPage = function (route, branch) {
            if (typeof route === 'string') {
                return this.addRoute(new GaiaRoute_1.default(route, new PageAction(branch)), true);
            }
            else {
                this._routes.push(route);
                return route;
            }
        };
        GaiaRouteGroup.prototype.addRoute = function (route, addToGroup) {
            if (addToGroup === void 0) { addToGroup = true; }
            if (addToGroup) {
                this._routes.push(route);
            }
            this._config.setDefaultsForRoute(route);
            // Get parsers and stringifiers from config
            var parsers = this._config.getParsers();
            for (var i = 0; i < parsers.length; i++) {
                var parser = parsers[i];
                if (route.getGroupName(parser.name)) {
                    route.parse(parser.name, parser.callback);
                }
            }
            var stringifiers = this._config.getStringifiers();
            for (var i = 0; i < stringifiers.length; i++) {
                var stringifier = stringifiers[i];
                if (route.getGroupName(stringifier.name)) {
                    route.stringify(stringifier.name, stringifier.callback);
                }
            }
            return route;
        };
        GaiaRouteGroup.prototype.resolvePage = function (url, callback, includeRedirects, isLanding) {
            //if (DEBUG) console.log('[GaiaRouteGroup] resolvePage: ', url, includeRedirects, isLanding, this._routes.length);
            var _this = this;
            if (includeRedirects === void 0) { includeRedirects = false; }
            if (isLanding === void 0) { isLanding = false; }
            for (var i = 0; i < this._routes.length; i++) {
                var route = this._routes[i];
                //			console.log(' try: ', route.getRoute());
                if (route.isMatch(url)) {
                    //				console.log('matched : ', routeAction.route);
                    if (route.getAction().type == RouteAction.REDIRECT) {
                        if (includeRedirects) {
                            // re-feed the redirect route to the resolver
                            this.resolvePage(route.getAction().execute(url, includeRedirects), function (routeResult) {
                                callback(routeResult);
                            }, includeRedirects, isLanding);
                            return;
                        }
                    }
                    else if (route.getAction().type == RouteAction.PAGE || route.getAction().type == RouteAction.ALIAS) {
                        // if we are landing on the site, and we have a landing redirect for this route, check it out!
                        if (isLanding && route.hasLandingRedirect()) {
                            // only if redirects are allowed
                            if (includeRedirects) {
                                // resolve the redirect with help if the RouteResultItem
                                route.resolveLandingRedirect(route.getAction().getPage(url, route, includeRedirects), function (redirectTo) {
                                    // recursive redirect!
                                    // todo check for circular redirects
                                    if (redirectTo == url) {
                                        _this._log.warn('[GaiaRouteGroup] we have spotted a recursive redirect!');
                                        callback(route.getAction().getPage(url, route, includeRedirects));
                                    }
                                    else {
                                        // re-feed the redirect route to the resolver
                                        _this.resolvePage(redirectTo, function (routeResult) {
                                            callback(routeResult);
                                        }, includeRedirects, isLanding);
                                    }
                                });
                                return;
                            }
                        }
                        else {
                            callback(route.getAction().getPage(url, route, includeRedirects));
                            return;
                        }
                    }
                }
            }
            callback(new RouteResultItem_1.default([]));
        };
        GaiaRouteGroup.prototype.getRoute = function (branch, params) {
            if (params === void 0) { params = {}; }
            // filter on branches
            var matches = this._routes.filter(function (element) {
                return (element.getAction().type == RouteAction.PAGE && element.getAction().branch == branch);
            });
            // sort on length
            matches.sort(function (a, b) {
                return a.getRoute().length < b.getRoute().length ? -1 : 1;
            });
            // filter on deeplink options if we have more than 1 match
            if (matches.length > 1 && typeof params !== 'undefined') {
                // deeplink params passed
                var deeplinkKeys = Object.keys(params);
                matches = matches.filter(function (element) {
                    for (var i = 0; i < deeplinkKeys.length; i++) {
                        var key = deeplinkKeys[i];
                        if (!element.getGroupName(key) || !element._assertParam(key, params[key])) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            if (matches.length == 0) {
                //			if (this.config().isUsingFallback())
                //			{
                //				var url = '/' + Gaia.api.getPage(branch).route.base;
                //				if (typeof params !== 'undefined')
                //				{
                //					for (var key in params)
                //					{
                //						if (String(params[key]).length > 0)
                //						{
                //							if (String(params[key]).charAt(0) != '/')
                //							{
                //								url += '/';
                //							}
                //							url += params[key];
                //						}
                //					}
                //				}
                //				return url;
                //			}
                if (!this._config.isUsingFallback()) {
                    this._log.warn('No match found for "' + branch + '" with deeplink ' + JSON.stringify(params));
                }
                return null;
            }
            if (matches.length > 1) {
                this._log.info('We have multiple candidates, I hope I picked the right one', matches);
            }
            return matches[0];
        };
        GaiaRouteGroup.prototype.getRouteByRoute = function (route) {
            for (var i = 0; i < this._routes.length; i++) {
                if (this._routes[i].getRoute() == route) {
                    return this._routes[i];
                }
            }
            return null;
        };
        return GaiaRouteGroup;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GaiaRouteGroup;
    var RedirectAction = (function () {
        function RedirectAction(redirect) {
            this.redirect = redirect;
            this.type = RouteAction.REDIRECT;
        }
        RedirectAction.prototype.execute = function (url, includeRedirects) {
            // todo: goto new route
            //console.log('redirect to: ' + this.redirect);
            if (includeRedirects === void 0) { includeRedirects = false; }
            return this.redirect;
        };
        return RedirectAction;
    })();
    exports.RedirectAction = RedirectAction;
    var HandleAction = (function () {
        function HandleAction(callback) {
            this.callback = callback;
            this.type = RouteAction.HANDLE;
            this.callback.call(null);
        }
        HandleAction.prototype.execute = function (url, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            return null;
        };
        return HandleAction;
    })();
    exports.HandleAction = HandleAction;
    var PageAction = (function () {
        function PageAction(branch, type) {
            if (type === void 0) { type = RouteAction.PAGE; }
            this.branch = branch;
            this.type = type;
            this._log = new Log_1.default('lib.gaia.router.PageAction');
        }
        PageAction.prototype.execute = function (url, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            this._log.error('not used');
        };
        PageAction.prototype.getPage = function (url, route, includeRedirects) {
            if (includeRedirects === void 0) { includeRedirects = false; }
            var result = new RouteResultItem_1.default([{ branch: this.branch, deeplink: route.getParams() }], url);
            //		result = (route.resolveChildren(url) || []).concat(result);
            return result;
        };
        return PageAction;
    })();
    exports.PageAction = PageAction;
    (function (RouteAction) {
        RouteAction[RouteAction["REDIRECT"] = 0] = "REDIRECT";
        RouteAction[RouteAction["HANDLE"] = 1] = "HANDLE";
        RouteAction[RouteAction["PAGE"] = 2] = "PAGE";
        RouteAction[RouteAction["ALIAS"] = 3] = "ALIAS";
    })(exports.RouteAction || (exports.RouteAction = {}));
    var RouteAction = exports.RouteAction;
});
