import GaiaRouterConfig from "lib/gaia/router/GaiaRouterConfig";
import GaiaRoute from "lib/gaia/router/GaiaRoute";
import GaiaRouteRequirement from "lib/gaia/router/GaiaRouteRequirement";
import GaiaRouteParser from "./GaiaRouteParser";
import GaiaRouteStringifier from "./GaiaRouteStringifier";
import IRouteResultItem from "lib/gaia/router/IRouteResultItem";
import RouteResultItem from "lib/gaia/router/RouteResultItem";
import Log from "../../temple/utils/Log";

/**
 * @namespace gaia.router
 * @class GaiaRouteGroup
 */
export default class GaiaRouteGroup
{
	private _config:GaiaRouterConfig;
	private _routes:Array<GaiaRoute> = [];

	private _log:Log = new Log('lib.gaia.router.GaiaRouteGroup');

	constructor(config:GaiaRouterConfig)
	{
		this._config = config;
	}

	public redirect(route:string, redirect:string):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new RedirectAction(redirect)));
	}

	public handle(route:string, callback:(params:any) => any):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new HandleAction(callback)));
	}

	public page(route:string, branch:string):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new PageAction(branch)));
	}

	public alias(route:string, branch:string):GaiaRoute
	{
		return this.addRoute(new GaiaRoute(route, new PageAction(branch, RouteAction.ALIAS)));
	}


	public childPage(route:GaiaRoute):GaiaRoute;
	public childPage(route:string, branch:string):GaiaRoute;
	public childPage(route:any, branch?:string):GaiaRoute
	{
		if (typeof route === 'string')
		{
			return this.addRoute(new GaiaRoute(route, new PageAction(branch)), true);
		}
		else
		{
			this._routes.push(route);

			return route;
		}
	}

	private addRoute(route:GaiaRoute, addToGroup:boolean = true):GaiaRoute
	{
		if (addToGroup)
		{
			this._routes.push(route);
		}

		this._config.setDefaultsForRoute(route);

		// Get parsers and stringifiers from config
		var parsers:Array<GaiaRouteParser> = this._config.getParsers();
		for (var i = 0; i < parsers.length; i++)
		{
			var parser:GaiaRouteParser = parsers[i];
			if (route.getGroupName(parser.name))
			{
				route.parse(parser.name, parser.callback);
			}
		}
		var stringifiers:Array<GaiaRouteStringifier> = this._config.getStringifiers();
		for (var i = 0; i < stringifiers.length; i++)
		{
			var stringifier:GaiaRouteStringifier = stringifiers[i];
			if (route.getGroupName(stringifier.name))
			{
				route.stringify(stringifier.name, stringifier.callback);
			}
		}

		return route;
	}

	public resolvePage(url:string, callback:(routeResult:IRouteResultItem) => void, includeRedirects:boolean = false, isLanding:boolean = false):void
	{
		//if (DEBUG) console.log('[GaiaRouteGroup] resolvePage: ', url, includeRedirects, isLanding, this._routes.length);

		for (var i = 0; i < this._routes.length; i++)
		{
			var route = this._routes[i];

//			console.log(' try: ', route.getRoute());
			if (route.isMatch(url))
			{
//				console.log('matched : ', routeAction.route);

				if (route.getAction().type == RouteAction.REDIRECT)
				{
					if (includeRedirects)
					{
						// re-feed the redirect route to the resolver
						this.resolvePage(route.getAction().execute(url, includeRedirects), (routeResult:IRouteResultItem) =>
						{
							callback(routeResult);
						}, includeRedirects, isLanding);
						return;
					}
				}
				else if (route.getAction().type == RouteAction.PAGE || route.getAction().type == RouteAction.ALIAS)
				{
					// if we are landing on the site, and we have a landing redirect for this route, check it out!
					if (isLanding && route.hasLandingRedirect())
					{
						// only if redirects are allowed
						if (includeRedirects)
						{
							// resolve the redirect with help if the RouteResultItem
							route.resolveLandingRedirect((<PageAction>route.getAction()).getPage(url, route, includeRedirects), (redirectTo:string) =>
							{
								// recursive redirect!
								// todo check for circular redirects
								if (redirectTo == url)
								{
									this._log.warn('[GaiaRouteGroup] we have spotted a recursive redirect!');
									callback((<PageAction>route.getAction()).getPage(url, route, includeRedirects));
								}
								else
								{
									// re-feed the redirect route to the resolver
									this.resolvePage(redirectTo, (routeResult:IRouteResultItem) =>
									{
										callback(routeResult);
									}, includeRedirects, isLanding);
								}
							});

							return;
						}
					}
					else
					{
						callback((<PageAction>route.getAction()).getPage(url, route, includeRedirects));
						return;
					}
				}
			}
		}

		callback(new RouteResultItem([]));
	}

	public getRoute(branch:string, params:any = {}):GaiaRoute
	{
		// filter on branches
		var matches = this._routes.filter((element) =>
		{
			return (element.getAction().type == RouteAction.PAGE && (<PageAction>element.getAction()).branch == branch);
		});

		// sort on length
		matches.sort((a, b) =>
		{
			return a.getRoute().length < b.getRoute().length ? -1 : 1;
		});

		// filter on deeplink options if we have more than 1 match
		if (matches.length > 1 && typeof params !== 'undefined')
		{
			// deeplink params passed
			var deeplinkKeys = Object.keys(params);

			matches = matches.filter((element) =>
			{
				for (var i = 0; i < deeplinkKeys.length; i++)
				{
					var key = deeplinkKeys[i];

					if (!element.getGroupName(key) || !element._assertParam(key, params[key]))
					{
						return false;
					}
				}

				return true;
			});
		}

		if (matches.length == 0)
		{
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

		if (matches.length > 1)
		{
			this._log.info('We have multiple candidates, I hope I picked the right one', matches);
//			console.log(JSON.stringify(matches));
		}

		return matches[0];
	}

	public getRouteByRoute(route:string):GaiaRoute
	{
		for (var i = 0; i < this._routes.length; i++)
		{
			if (this._routes[i].getRoute() == route)
			{
				return this._routes[i];
			}
		}
		return null;
	}
}

export interface IRouteAction
{
	type:RouteAction;

	execute(url:string, includeRedirects?:boolean):any;
}

export class RedirectAction implements IRouteAction
{
	public type:RouteAction = RouteAction.REDIRECT;

	constructor(public redirect:string)
	{

	}

	public execute(url:string, includeRedirects:boolean = false):any
	{
		// todo: goto new route
		//console.log('redirect to: ' + this.redirect);

		return this.redirect;
	}
}

export class HandleAction implements IRouteAction
{
	public type:RouteAction = RouteAction.HANDLE;

	constructor(public callback:(params:any) => any)
	{
		this.callback.call(null);
	}

	public execute(url:string, includeRedirects:boolean = false):any
	{
		return null;
	}
}

export class PageAction implements IRouteAction
{
	private _log:Log = new Log('lib.gaia.router.PageAction');

	constructor(public branch:string, public type:RouteAction = RouteAction.PAGE)
	{

	}

	public execute(url:string, includeRedirects:boolean = false):any
	{
		this._log.error('not used');
	}

	public getPage(url:string, route:GaiaRoute, includeRedirects:boolean = false):IRouteResultItem
	{
		var result:IRouteResultItem = new RouteResultItem([{branch: this.branch, deeplink: route.getParams()}], url);

//		result = (route.resolveChildren(url) || []).concat(result);

		return result;
	}
}

export enum RouteAction
{
	REDIRECT,
	HANDLE,
	PAGE,
	ALIAS
}