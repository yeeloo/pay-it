import GaiaRouteRequirement from "./GaiaRouteRequirement";
import IRouteResultItem from "./IRouteResultItem";
import GaiaRoute from "./GaiaRoute";
import GaiaRouteParser from "./GaiaRouteParser";
import GaiaRouteStringifier from "./GaiaRouteStringifier";

/**
 * @namespace gaia.router
 * @class GaiaRouterConfig
 */
class GaiaRouterConfig
{
	private _enabled:boolean = true;
	private _includeQueryString:boolean = false;
	private _useFallback:boolean = false;
	private _removeExtraSlashes:boolean = false;
	private _requirements:Array<GaiaRouteRequirement> = [];
	private _parsers:Array<GaiaRouteParser> = [];
	private _stringifiers:Array<GaiaRouteStringifier> = [];
	private _redirectOnLanding:any;
	private _defaultLocale:string;
	private _localeRegExp:RegExp;

	/**
	 * @public
	 * @method disable
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public disable():GaiaRouterConfig
	{
		this._enabled = false;

		return this;
	}

	/**
	 * @public
	 * @method enable
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public enable():GaiaRouterConfig
	{
		this._enabled = true;

		return this;
	}

	/**
	 * @public
	 * @method isEnabled
	 * @returns {boolean}
	 */
	public isEnabled():boolean
	{
		return this._enabled;
	}


	/**
	 * @public
	 * @method useFallback
	 * @param {boolean} value
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public useFallback(value:boolean = true):GaiaRouterConfig
	{
		this._useFallback = value;

		return this;
	}

	/**
	 * @public
	 * @method includeQueryString
	 * @param value
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public includeQueryString(value:boolean = true):GaiaRouterConfig
	{
		this._includeQueryString = value;

		return this;
	}

	/**
	 * @public
	 * @method isQueryStringIncluded
	 * @returns {boolean}
	 */
	public isQueryStringIncluded():boolean
	{
		return this._includeQueryString;
	}

	/**
	 * @public
	 * @method isUsingFallback
	 * @returns {boolean}
	 */
	public isUsingFallback():boolean
	{
		return this._useFallback;
	}

	/**
	 * @public
	 * @method removeExtraSlashes
	 * @param value
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public removeExtraSlashes(value:boolean = true):GaiaRouterConfig
	{
		this._removeExtraSlashes = value;

		return this;
	}

	/**
	 * @public
	 * @method assert
	 * @param name
	 * @param assertion
	 * @returns gaia.router.GaiaRouterConfig
	 */
	public assert(name:string, assertion:string):GaiaRouterConfig;
	public assert(name:string, assertion:RegExp):GaiaRouterConfig;
	public assert(name:string, assertion:(value:string) => boolean):GaiaRouterConfig;
	public assert(name:string, assertion:any):GaiaRouterConfig
	{
		this._requirements.push(new GaiaRouteRequirement(name, assertion));

		return this;
	}

	/**
	 * @public
	 * @method parse
	 * @param name
	 * @param callback
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public parse(name:string, callback:(param:string) => any):GaiaRouterConfig
	{
		this._parsers.push(new GaiaRouteParser(name, callback));

		return this;
	}


	/**
	 * @public
	 * @method stringify
	 * @param name
	 * @param callback
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public stringify(name:string, callback:(param:any) => string):GaiaRouterConfig
	{
		this._stringifiers.push(new GaiaRouteStringifier(name, callback));

		return this;
	}

	/**
	 * @public
	 * @method setLocale
	 * @param locale
	 * @method redirectOnLanding
	 * @param {string} route
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public redirectOnLanding(route:string):GaiaRouterConfig;

	/**
	 * @public
	 * @method redirectOnLanding
	 * @param {(routeResult:IRouteResultItem, callback:(route:string) => void) => void} callback
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public redirectOnLanding(callback:(routeResult:IRouteResultItem, callback:(route:string) => void) => void):GaiaRouterConfig;

	public redirectOnLanding(route:any = '/'):GaiaRouterConfig
	{
		this._redirectOnLanding = route;

		return this;
	}


	/**
	 * @public
	 * @method setDefaultLocale
	 * @param {string} locale
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public setDefaultLocale(locale:string):GaiaRouterConfig
	{
		this._defaultLocale = locale;

		return this;
	}

	/**
	 * @public
	 * @method setLocaleRegExp
	 * @param {RegExp} localeRegExp
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public setLocaleRegExp(localeRegExp:RegExp):GaiaRouterConfig
	{
		this._localeRegExp = localeRegExp;
		return this;
	}

	/**
	 * @public
	 * @method getDefaultLocale
	 * @returns {string}
	 */
	public getDefaultLocale():string
	{
		return this._defaultLocale;
	}

	/**
	 * @public
	 * @method getLocaleRegExp
	 * @returns {RegExp}
	 */
	public getLocaleRegExp():RegExp
	{
		return this._localeRegExp;
	}

	/**
	 * @public
	 * @method setTranslator
	 * @param translator
	 * @param translationPath
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public setTranslator(translator:any, translationPath:string):GaiaRouterConfig
	{
		return this;
	}

	/**
	 * @public
	 * @method getRequirements
	 * @returns {gaia.router.GaiaRouteRequirement[]}
	 */
	public getRequirements():Array<GaiaRouteRequirement>
	{
		return this._requirements;
	}

	/**
	 * @public
	 * @method getStringifiers
	 * @returns {gaia.router.GaiaRouteStringifier[]}
	 */
	public getStringifiers():Array<GaiaRouteStringifier>
	{
		return this._stringifiers;
	}

	/**
	 * @public
	 * @method getParsers
	 * @returns {gaia.router.GaiaRouteParser[]}
	 */
	public getParsers():Array<GaiaRouteParser>
	{
		return this._parsers;
	}

	/* internal */ setDefaultsForRoute(route:GaiaRoute):void
	{
		for (var i = 0; i < this._requirements.length; i++)
		{
			var requirement:GaiaRouteRequirement = this._requirements[i];
			if (route.getGroupName(requirement.name))
			{
				route.assert(requirement.name, requirement.assertion);
			}
		}

		for (var i = 0; i < this._parsers.length; i++)
		{
			var parser:GaiaRouteParser = this._parsers[i];
			if (route.getGroupName(parser.name))
			{
				route.parse(parser.name, parser.callback);
			}
		}

		for (var i = 0; i < this._stringifiers.length; i++)
		{
			var stringifier:GaiaRouteStringifier = this._stringifiers[i];
			if (route.getGroupName(stringifier.name))
			{
				route.stringify(stringifier.name, stringifier.callback);
			}
		}

		if (this._redirectOnLanding)
		{
			route.redirectOnLanding(this._redirectOnLanding);
		}
	}

}

export default GaiaRouterConfig;