import refdef from "def/ReferenceDefinitions";
import {default as GaiaRouteGroup, IRouteAction, PageAction} from "lib/gaia/router/GaiaRouteGroup";
import GroupName from "lib/gaia/router/GroupName";
import GaiaRouteRequirement from "lib/gaia/router/GaiaRouteRequirement";
import GaiaRouteParser from "lib/gaia/router/GaiaRouteParser";
import GaiaRouteStringifier from "lib/gaia/router/GaiaRouteStringifier";
import IRouteResultItem from "lib/gaia/router/IRouteResultItem";
import Log from "../../temple/utils/Log";

/**
 * @namespace gaia.router
 * @class GaiaRoute
 */
class GaiaRoute
{
	private _action:IRouteAction;
	private _route:string;
	private _parentRoute:GaiaRoute;
	private _regExp:any;
	private _regExpRoute:string;
	private _groupNames:Array<GroupName> = [];
	private _params:{[key:string]: any;} = {};

	private _requirements:{[key:string]: GaiaRouteRequirement;	} = {};
	private _defaults:{[key:string]: string;} = {};
	private _parsers:{[key:string]: GaiaRouteParser;} = {};
	private _stringifiers:{[key:string]: GaiaRouteStringifier;} = {};

	private _redirectOnLanding:any = null;
	private _spec:string;
	private _map:Array<string> = [];
	private _beforeMatches:Array<Matcher> = [];
	private _afterMatches:{[key:string]:Array<Matcher>;} = {};
	private _group:GaiaRouteGroup;

	private _log:Log = new Log('lib.gaia.router.GaiaRoute');

	/**
	 * @class GaiaRoute
	 * @constructor
	 * @param {string} route
	 * @param {IRouteAction} action
	 */
	constructor(route:string, action:IRouteAction)
	{
		this._route = route;
		this._action = action;

		this._group = new GaiaRouteGroup(null);
	}

	/**
	 * @method assert
	 * @param {string} name
	 * @param {string} assertion
	 * @returns {GaiaRoute}
	 */
	public assert(name:string, assertion:string):GaiaRoute;
	public assert(name:string, assertion:RegExp):GaiaRoute;
	public assert(name:string, assertion:(value:string) => boolean):GaiaRoute;
	public assert(name:string, assertion:any):GaiaRoute
	{
		this._requirements[name] = new GaiaRouteRequirement(name, assertion);

		return this;
	}

	public value(name:string, value:any):GaiaRoute
	{
		this._defaults[name] = value;

		return this;
	}

	public map(names:Array<string>):GaiaRoute
	{
		this._map = names.concat();

		return this;
	}

	public spec(spec:string):GaiaRoute
	{
		this._spec = spec;

		return this;
	}

	public parse(name:string, callback:(param:string) => any):GaiaRoute
	{
		this._parsers[name] = new GaiaRouteParser(name, callback);

		return this;
	}

	public stringify(name:string, callback:(param:any) => string):GaiaRoute
	{
		this._stringifiers[name] = new GaiaRouteStringifier(name, callback);

		return this;
	}

	public redirectOnLanding(route:string):GaiaRoute;
	public redirectOnLanding(callback:(routeResult:IRouteResultItem, callback:(route:string) => void) => void):GaiaRoute;
	public redirectOnLanding(route:any = '/'):GaiaRoute
	{
		this._redirectOnLanding = route;

		return this;
	}

	public beforeMatch(name:string, callback:(params:any) => boolean):GaiaRoute
	{
		this._beforeMatches.push(new Matcher(name, callback));

		return this;
	}

	public afterMatch(name:string, callback:(params:any) => boolean):GaiaRoute
	{
		if (!this._afterMatches[name])
		{
			this._afterMatches[name] = [];
		}

		this._afterMatches[name].push(new Matcher(name, callback));

		return this;
	}

	public children(children:Array<GaiaRoute>):GaiaRoute
	{
		throw new Error('not implemented yet');

		for (var i = 0; i < children.length; i++)
		{
			this.addChild(children[i]);
		}

		return this;
	}

	public addChild(route:GaiaRoute):GaiaRoute
	{
		throw new Error('not implemented yet');

		route.setParent(this);

		this._group.childPage(route);

		return this;
	}

	public setParent(route:GaiaRoute):GaiaRoute
	{
		this._parentRoute = route;

		this._regExp = null;

		return this;
	}

	private updateRegExp():RegExp
	{
		if (!this._regExp)
		{
			var groupNameObj:any = {};

			var route = this._route['replace'](/\/:([a-z]+)([\?\*])?/gi, (substring: string, groupName:string, modifier:string) =>
			{
				var replacment = '';
				groupNameObj[groupName] = {};

				if (modifier == '*')
				{
					groupNameObj[groupName].greedy = true;
					replacment = '(?<' + groupName + '>\/.*?)';
				}
				else if (modifier == '?' || groupName in this._defaults)
				{
					groupNameObj[groupName].optional = true;
					replacment =  '(?:\/(?<' + groupName + '>[^\/]+))?\/?';
				}
				else
				{
					replacment = '(?:\/(?<' + groupName + '>[^\/]+))\/?';
				}

				return replacment;
			});

			this._regExpRoute = route;

			this._regExp = XRegExp('^' + (this._parentRoute ? this._parentRoute.getRegexpRoute() : '') + this._regExpRoute + '$', 'i');
//			console.log('^' + (this._parentRoute ? this._parentRoute.getRegexpRoute() : '') + this._regExpRoute + '$');
			var names = this._regExp.xregexp.captureNames ? this._regExp.xregexp.captureNames.concat() : [];
			//console.log(names);

			for (var i = 0; i < names.length; i++)
			{
				var name = names[i];

				if (name)
				{
					this._groupNames.push({
						name: name,
						optional: groupNameObj[name] ? groupNameObj[name].optional : false,
						greedy: groupNameObj[name] ? groupNameObj[name].greedy : false
					});
				}
				else
				{
					this._log.warn('ignoring unnamed group in route "' + this._route + '"');
				}
			}
		}

		return this._regExp;
	}

	public isMatch(url:string):boolean
	{
		var match = XRegExp['exec'](url, this.updateRegExp());

		if (match == null)
		{
			return false;
		}

		if (match)
		{
			this._params = {};

//			console.log('match: ', match, this._regExpRoute);
			for (var i = 0; i < this._groupNames.length; i++)
			{
				var groupName = this._groupNames[i].name;
				var groupMatch = match[groupName];

				if (groupMatch)
				{
					if (!this._assertParam(groupName, groupMatch))
					{
						return false;
					}
				}

				if (!groupMatch && groupName in this._defaults)
				{
					groupMatch = this._defaults[groupName];
				}

				if (groupMatch)
				{
					if (groupName in this._parsers)
					{
						groupMatch = (<GaiaRouteParser>this._parsers[groupName]).callback.call(null, groupMatch);
					}
				}

				this._params[groupName] = groupMatch;
			}
		}

		return true;
	}

	public resolveChildren(url:string):IRouteResultItem
	{
		throw new Error('not implemented yet');

//		console.log('resolveChildren: ', url);
//		return this._group.resolvePage(url);
	}

	public assemble(deeplink?:any):string
	{
		//if (DEBUG) console.log('[GaiaRoute] assemble: ', deeplink);

		if (this._spec)
		{
			return this._spec['replace'](/\/\{([^}]+)\}/gi, (result, groupName) =>
			{
				// parts incl starting '/' that gets removed when part is optional

				if (deeplink.hasOwnProperty(groupName))
				{
					return '/' + deeplink[groupName];
				}
				else
				{
					if (this.getGroupName(groupName) && !this.getGroupName(groupName).optional)
					{
						this._log.error('spec: missing "' + groupName + '" from deeplink object ' + JSON.stringify(deeplink) + ' in route ' + this._route);
					}
					return '';
				}
			})['replace'](/\{([^}]+)\}/gi, (result, groupName) =>
			{
				// parts excl starting '/'
				if (deeplink.hasOwnProperty(groupName))
				{
					return deeplink[groupName];
				}
				else
				{
					if (this.getGroupName(groupName) && !this.getGroupName(groupName).optional)
					{
						this._log.error('spec: missing "' + groupName + '" from deeplink object ' + JSON.stringify(deeplink) + ' in route ' + this._route);
					}
					return '';
				}
			});
		}

		return this._route['replace'](/\/:([a-z]+)([\?\*])?/gi, (substring: string, groupName:string, modifier:string) =>
		{
			var value:any;

			if (this.getGroupName(groupName).optional)
			{
				// if a property is provided in the deeplink object
				if (deeplink && deeplink.hasOwnProperty(groupName))
				{
					value = deeplink[groupName];
				}
				// if we have a default value for this property
				else if (this._defaults.hasOwnProperty(groupName))
				{
					value = this._defaults[groupName];
				}
				// we don't have any value for this groupName
				else
				{
					return '';
				}
			}
			else
			{
				if (deeplink && deeplink.hasOwnProperty(groupName))
				{
					value = deeplink[groupName];
				}
				else
				{
					this._log.error('route: missing "' + groupName + '" from deeplink object ' + JSON.stringify(deeplink) + ' in route ' + this._route);
					return '';
				}
			}

			if (groupName in this._stringifiers)
			{
				value = (<GaiaRouteParser>this._stringifiers[groupName]).callback.call(null, value);
			}

			return '/' + value;

		}) || '/';
	}

	public _assertParam(param:string, value:any):boolean
	{
		this.updateRegExp();

		var success = !(param in this._requirements) || (param in this._requirements && this._requirements[param].assert(value));

		if (DEBUG)
		{
			if (!success)
			{
				if (param in this._requirements)
				{
					this._log.info('assertion failed for param "' + param + '" failed on requirement "' + this._requirements[param].assertion.toString() + '" - value: ' + value);
				}
			}
		}

		return success;
	}

	public getParams():any
	{
		return this._params;
	}

	public getRoute():string
	{
		return this._route;
	}

	public getRegexpRoute():string
	{
		return this._regExpRoute;
	}

	public hasLandingRedirect():boolean
	{
		return this._redirectOnLanding != null;
	}

	/**
	 * Resolves the redirect landing, either by calling a method that can be resolved async, or by returning a string
	 *
	 * @method resolveLandingRedirect
	 * @param {IRouteResultItem} routeResult
	 * @param {Function} callback
	 */
	public resolveLandingRedirect(routeResult:IRouteResultItem, callback:(route:string) => void):void
	{
		if (typeof this._redirectOnLanding == "function")
		{
			this._redirectOnLanding(routeResult, (route:string) =>
			{
				callback(route);
			});
		}
		else
		{
			callback(this._redirectOnLanding);
		}
	}

	public getGroupNames():Array<GroupName>
	{
		this.updateRegExp();

		return this._groupNames;
	}

	public getGroupName(name:string):GroupName
	{
		this.updateRegExp();

		for (var i = 0; i < this._groupNames.length; i++)
		{
			var group = this._groupNames[i];
			if (group.name == name) return group;
		}

		return null;
	}

	public getAction():IRouteAction
	{
		return this._action;
	}

	public setBranch(branch:string):void
	{
		(<PageAction>this._action).branch = branch;
	}
}

export default GaiaRoute;

class Matcher
{
	constructor(public name:string, public callback:(params:any) => boolean)
	{

	}
}