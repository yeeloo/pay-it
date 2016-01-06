//import * as Gaia from "lib/gaia/api/Gaia";
//import BranchTools from "lib/gaia/core/BranchTools";
//import SiteModel from "lib/gaia/core/SiteModel";

import GaiaRouterConfig from "lib/gaia/router/GaiaRouterConfig";
import {default as GaiaRouteGroup} from "lib/gaia/router/GaiaRouteGroup";
import GaiaRoute from "lib/gaia/router/GaiaRoute";
import GaiaRouteRequirement from "lib/gaia/router/GaiaRouteRequirement";
import GaiaRouteConvert from "lib/gaia/router/GaiaRouteParser";
import IRouteResultItem from "lib/gaia/router/IRouteResultItem";
import RouteResultItem from "lib/gaia/router/RouteResultItem";

import IGaiaHistory from "lib/gaia/core/IGaiaHistory";
import Log from "../../temple/utils/Log";

/**
 * @namespace gaia.router
 * @class GaiaRouter
 */
class GaiaRouter
{
	private _gaiaHistory:IGaiaHistory;
	private _config:GaiaRouterConfig;
	private _group:GaiaRouteGroup;
	private _notFound:string;
	private _base:string;
	private _queryString:string;
	private _locale:string;
	private _localValue:string = '';

	/**
	 * @class GaiaRouter
	 * @constructor
	 * @param gaiaHistory [IGaiaHistory]
	 */
	constructor(gaiaHistory:IGaiaHistory)
	{
		this._gaiaHistory = gaiaHistory;
		this._config = new GaiaRouterConfig();
		this._group = new GaiaRouteGroup(this._config);
	}

	/**
	 * @public
	 * @method config
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public config():GaiaRouterConfig
	{
		return this._config;
	}

	/**
	 * Init GaiaRouter
	 *
	 * @public
	 * @method init
	 */
	public init():void
	{
		var base:HTMLElement = <HTMLElement> document.querySelector('meta[name="document-base"]');

		this._base = base !== null ? base.getAttribute('content') : null;

		// not defined, set root of domain
		if (this._base === null)
		{
			this._base = document.location.protocol + '//' + document.location.host + '/';
		}
		// set, but host not in value, use as relative
		else if (this._base.indexOf(document.location.host) == -1)
		{
			this._base = document.location.protocol + '//' + document.location.host + (this._base.charAt(0) == '/' ? '' : '/') + this._base;
		}

		// force trailing /
		if (this._base.split('').pop() != '/')
		{
			this._base += '/';
		}

		if (this._config.isEnabled())
		{
			// get path for emulated redirect
			history['redirect'] && history['redirect']('/', this._base.replace(document.location.protocol + '//' + document.location.host, ''));
		}

		// this will retrieve the locale from the url
		this.getHistoryValue();

		// todo Async change route in start

		// If load event is already dispatched add popstate listener
		if (document.readyState === 'complete')
		{
			this.bindPopstateListener();
		}
		else
		{
			window.addEventListener('load', this.bindPopstateListener);
		}
	}

	/**
	 * @public
	 * @method start
	 */
	public start():void
	{
		this.notifyHistory(this.getRoute(), true);
	}

	/**
	 * Return locale
	 *
	 * @public
	 * @method getLocale
	 * @return {string} locale
	 */
	public getLocale():string
	{
		return this._locale || this._config.getDefaultLocale();
	}

	/**
	 * Set locale
	 *
	 * @public
	 * @method setLocale
	 * @param {string} locale
	 */
	public setLocale(locale:string)
	{
		this._locale = locale;

		this.setHistoryValue(this.getHistoryValue(true));
	}

	/**
	 * Return the current route
	 *
	 * @public
	 * @method getRoute
	 * @returns {string} Current route
	 */
	public getRoute():string
	{
		return this.getHistoryValue();
	}

	/**
	 * Set current route; Set replace if you want to replace the current route in history.
	 *
	 * @public
	 * @method setRoute
	 * @param {string} route
	 * @param {boolean} [replace=false]
	 */
	public setRoute(route:string, replace:boolean = false):void
	{
		//if (DEBUG) console.log('[GaiaRouter] setRoute: ', route, replace);

		this.setHistoryValue(route, replace);

		this.notifyHistory(route);
	}

	/**
	 * Returns a query parameter, the part after the `?`
	 *
	 * @public
	 * @method getQueryParam
	 * @param {string} key
	 * @returns {string}
	 */
	public getQueryParam(key:string):string
	{
		return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

	/**
	 * Add a branch that functions as 404
	 *
	 * @public
	 * @method notFound
	 * @param {string} branch
	 * @returns {GaiaRouter}
	 */
	public notFound(branch:string):GaiaRouter
	{
		this._notFound = branch;

		return this;
	}

	/**
	 * Redirect route
	 *
	 * @public
	 * @method redirect
	 * @param {string} route
	 * @param {string} redirect
	 */
	public redirect(route:string, redirect:string):GaiaRoute
	{
		return this._group.redirect(route, redirect);
	}

	/**
	 * Add a callback when a route gets resolved
	 *
	 * @public
	 * @method handle
	 * @param {string} route
	 * @param {function} callback
	 */
	public handle(route:string, callback:(params:any) => any):GaiaRoute
	{
		return this._group.handle(route, callback);
	}

	/**
	 * @public
	 * @method page
	 * @param {string} route
	 * @param {string} page
	 */
	public page(route:string, branch:string):GaiaRoute
	{
		return this._group.page(route, branch);
	}

	/**
	 * Add an alias for a route
	 *
	 * @public
	 * @method alias
	 * @param {string} route
	 * @param {string} branch
	 */
	public alias(route:string, branch:string):GaiaRoute
	{
		return this._group.alias(route, branch);
	}

	/**
	 * @public
	 * @method childPage
	 * @param {string} route
	 * @param {string} branch
	 */
	public childPage(route:string, branch:string):GaiaRoute
	{
		return this._group.childPage(route, branch);
	}

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
	public resolvePage(url:string, callback:(routeResult:IRouteResultItem) => void, includeRedirects:boolean = false, isLanding:boolean = false):void
	{
		var i:number;
		if (!this._config.isQueryStringIncluded() && (i = url.indexOf('?')) != -1) url = url.substr(0, i);

		this._group.resolvePage(url, (routeResult:IRouteResultItem) =>
		{
			if (routeResult.length > 0)
			{
				callback(routeResult);
				return;
			}

			if (this._notFound)
			{
				// todo: goto 404 route
				callback(new RouteResultItem([{branch: this._notFound, deeplink: {}}], url));
			}
			else
			{
				Log.info('Gaia.Router.GaiaRouter', 'no route found for "' + url + '", redirecting to index!');

				// todo: goto home
				callback(new RouteResultItem([{branch: 'index', deeplink: {}}], url));
			}
		}, includeRedirects, isLanding);

	}

	/**
	 * @public
	 * @method assemble
	 * @param {string} branch
	 * @param {any} params
	 */
	public assemble(branch:string, params:any = {}):string
	{
		var route = this._group.getRoute(branch, params);

		return route ? route.assemble(params) : null;
	}

	/**
	 * @public
	 * @method getGroup
	 * @return {gaia.router.GaiaRouteGroup}
	 */
	public getGroup():GaiaRouteGroup
	{
		return this._group;
	}

	/**
	 * @private
	 * @method notifyHistory
	 * @param {string} route
	 * @param {boolean} [isLanding=false]
	 */
	private notifyHistory(route:string, isLanding:boolean = false):void
	{
		//if (DEBUG) console.log('[GaiaRouter] notifyHistory: ', route);
		this.resolvePage(route, (routeResult:IRouteResultItem) =>
		{
			//if (DEBUG) console.log(' - ', routeResult);

			Object.freeze(routeResult[0].deeplink);

			// check for redirects on landing, and do a replaceState
			if (routeResult.route != route && isLanding)
			{
				//console.log('- redirect!');
				this.setHistoryValue(routeResult.route, true);
			}

			this._gaiaHistory.onChange(routeResult);
		}, true, isLanding);
	}

	/**
	 * @private
	 * @method getHistoryValue
	 * @param {boolean} [skipLocale=false]
	 * @param {boolean} [ignoreEnabledState=false]
	 * @return {string} route
	 */
	private getHistoryValue(skipLocale:boolean = false, ignoreEnabledState:boolean = false):string
	{
		if (!this._config.isEnabled() && !ignoreEnabledState)
		{
			return this._localValue;
		}

		// fix for weird IE version
		var location = (history['location'] || document.location).href || document.location.href;

		this._queryString = document.location.search;

		// force trailing /
		if (location.split('').pop() != '/')
		{
			location += '/';
		}

		// prevent future errors
		if (location == undefined || location == null)
		{
			location = '';
		}

		// strip basepath, leave deeplink
		if (location.indexOf(this._base) == 0)
		{
			location = location.replace(this._base, '')
		}

		// force starting /
		if (location.charAt(0) != '/')
		{
			location = '/' + location;
		}
		// remove trailing /
		if (location.split('').pop() == '/')
		{
			location = location.substr(0, location.length - 1);
		}

		// locale hook
		if (!skipLocale)
		{
			var locale = this._config.getLocaleRegExp().exec(location);

			if (locale)
			{
				this._locale = locale[1];
			}
		}

		location = location.replace(this._config.getLocaleRegExp(), '');
		// end locale hook

		// force starting /
		if (location.charAt(0) != '/')
		{
			location = '/' + location;
		}

		//console.log('[GaiaRouter] getHistoryValue: ', location);

		return location;
	}

	/**
	 * @private
	 * @method setHistoryValue
	 * @param {string} value
	 * @param {boolean} [replace=false]
	 */
	private setHistoryValue(value:string, replace:boolean = false):void
	{
		//console.log('[GaiaRouter] setHistoryValue: ', value, replace);

		if (!this._config.isEnabled())
		{
			this._localValue = value;
			return;
		}

		// absolute
		if (value.charAt(0) == '/')
		{
			// chrome
			if (!history['emulate'])
			{
				value = value.substr(1);
			}
		}
		else
		{
			// chrome
			if (!history['emulate'])
			{
				value = (this.getHistoryValue(true).replace(/[^\/]+$/g, '') + value).substr(1);
			}
		}

		// absolute
		if (value.charAt(0) == '/')
		{
			// locale hook
			value = (this._locale ? '/' + this._locale : '') + value;
		}
		// relative
		else
		{
			// locale hook
			value = (this._locale ? this._locale + '/' : '') + value;
		}

		if (this._queryString.length > 0)
		{
			value += this._queryString;
		}

		if (!history['emulate'])
		{
			history[replace ? 'replaceState' : 'pushState'](null, null, this._base + (value.charAt(0) == '/' ? value.substr(0) : value));
		}
		else
		{
			history[replace ? 'replaceState' : 'pushState'](null, null, value);
		}
	}

	/**
	 * Bind the popstate event listener
	 *
	 * @private
	 * @method bindPopstateListener
	 * @param {event} event
	 */
	private bindPopstateListener = ( event?:Event ) =>
	{
		// Temporary method that binds the popstate event
		var bindPopstate:()=>void = () =>
		{
			window.addEventListener('popstate', () =>
			{
				this.notifyHistory(this.getRoute());
			});
		};

		if (event)
		{
			// Remove load event
			window.removeEventListener('load', this.bindPopstateListener);

			// Bind popstate event at the end of the call stack
			setTimeout(() => {
				bindPopstate();
				bindPopstate = null;
			}, 0);
		}
		else
		{
			// Bind popstate event
			bindPopstate();
			bindPopstate = null;
		}

	};
}

export default GaiaRouter;