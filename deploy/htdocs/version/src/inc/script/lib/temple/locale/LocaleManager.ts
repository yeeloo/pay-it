import EventDispatcher from "lib/temple/events/EventDispatcher";
import CommonEvent from "lib/temple/events/CommonEvent";
import ILocaleProvider from "./provider/core/interface/ILocaleProvider";
import Log from "../utils/Log";

/**
 * @module Temple
 * @namespace temple.locale
 * @class LocaleManager
 * @extend temple.events.EventDispatcher
 */
class LocaleManager extends EventDispatcher
{
	private static _instance:LocaleManager;

	private _log:Log = new Log('lib.temple.locale.LocaleManager');

	public static getInstance():LocaleManager
	{
		if (!LocaleManager._instance)
		{
			LocaleManager._instance = new LocaleManager();
		}

		return LocaleManager._instance;
	}

	private _locale:string;
	private _fallbackLocale:string;
	private _strings:any = {};
	private _keys:any = {};
	private _providers:Array<ILocaleProvider> = [];
	private _aliases:{[source:string]: string;} = {}; // { source: target }

	constructor(locale:string = null)
	{
		super();

		// this._locale = locale || (window.navigator.userLanguage || window.navigator['language']).replace('-', '_');

		window['localeManager'] = this;
	}

	/**
	 * @public
	 * @method getLanguage
	 * @returns {string}
	 */
	public getLanguage():string
	{
		return this._locale.split('_')[0];
	}

	/**
	 * @public
	 * @method getCountry
	 * @returns {string}
	 */
	public getCountry():string
	{
		return this._locale.split('_')[1];
	}

	/**
	 * @public
	 * @method getLocale
	 * @returns {string}
	 */
	public getLocale():string
	{
		return this._locale;
	}

	/**
	 * @public
	 * @method addAlias
	 * @param {string} source
	 * @param {string} target
	 */
	public addAlias(source:string, target:string)
	{
		this._aliases[ source ] = target;
	}

	/**
	 * @public
	 * @method getAlias
	 * @param {string} source
	 * @returns {string}
	 */
	public getAlias(source:string):string
	{
		return this._aliases[ source ];
	}

	/**
	 * @public
	 * @method setLocale
	 * @param {string} locale
	 */
	public setLocale(locale:string)
	{
		this._log.log('setLocale', locale);

		if (!locale)
		{
			return;
		}

		if (typeof this.getAlias( locale ) != 'undefined')
		{
			locale = this.getAlias( locale );
		}

		if (locale != this._locale)
		{
			this._locale = locale;

			this.dispatchEvent(new CommonEvent(CommonEvent.CHANGE));

			this.checkProviders(this._locale);
			this.update();
		}
	}

	/**
	 * @public
	 * @method setFallbackLocale
	 * @param {string} locale
	 */
	public setFallbackLocale(locale:string)
	{
		this._fallbackLocale = locale;
	}

	/**
	 * @public
	 * @method getFallbackLocale
	 * @returns {string}
	 */
	public getFallbackLocale():string
	{
		return this._fallbackLocale;
	}

	/**
	 * @public
	 * @method hasLocale
	 * @param locale
	 * @returns {boolean}
	 */
	public hasLocale(locale)
	{
		return this._strings.hasOwnProperty(locale) && this._strings[locale] != null;
	}

	/**
	 * @public
	 * @method addLocale
	 * @param {string} locale
	 */
	public addLocale(locale:string):void
	{
		if (!this.hasLocale(locale))
		{
			this._strings[locale] = {};
			this._keys[locale] = {};
		}
	}

	/**
	 * @public
	 * @method getKeys
	 * @param {string} path
	 * @param {string} locale
	 * @returns {string:[]}
	 */
	public getKeys(path:string, locale:string = null):string[]
	{
		if (locale == 'debug' || (!locale && this._locale == 'debug'))
		{
			return [];
		}
		else if (locale)
		{
			if (this.hasLocale(locale) && this._keys[locale][path])
			{
				return this._keys[locale][path];
			}
		}
		else
		{
			if (this.hasLocale(this._locale) && this._keys[this._locale][path] != undefined && this._keys[this._locale][path] != null)
			{
				return this._keys[this._locale][path];
			}
			else if (this._fallbackLocale)
			{
				return [this.getString(path, this._fallbackLocale)];
			}
		}

		this._log.log("getString: no text found for '" + path + "', locale '" + (locale || this._locale) + "'");

		// nothing found, return empty string.
		return [];
	}

	/**
	 * @public
	 * @method getString
	 * @param {string}id
	 * @param {string} locale
	 * @returns {string}
	 */
	public getString(id:string, locale:string = null):string
	{
		if (locale == 'debug' || (!locale && this._locale == 'debug'))
		{
			return '__' + id + '__';
		}
		else if (locale)
		{
			if (this.hasLocale[locale] && this._strings[locale][id])
			{
				return this._strings[locale][id];
			}
		}
		else
		{
			if (this.hasLocale(this._locale) && this._strings[this._locale][id] != undefined && this._strings[this._locale][id] != null)
			{
				return this._strings[this._locale][id];
			}
			else if (this._fallbackLocale)
			{
				return this.getString(id, this._fallbackLocale);
			}
		}

		this._log.log("getString: no text found for '" + id + "', locale '" + (locale || this._locale) + "'");

		// nothing found, return empty string.
		return '';
	}

	/**
	 * @public
	 * @method setString
	 * @param {string} locale
	 * @param {string} id
	 * @param {string} text
	 */
	public setString(locale:string, id:string, text:string):void
	{
		if (!this.hasLocale(locale))
		{
			this.addLocale(locale);
		}

		this._strings[locale][id] = text;
	}

	/**
	 * @public
	 * @method setKeys
	 * @param {string} locale
	 * @param {string} id
	 * @param {string} text
	 */
	public setKeys(locale:string, id:string, text:string[]):void
	{
		if (!this.hasLocale(locale))
		{
			this.addLocale(locale);
		}

		this._keys[locale][id] = text;
	}

	/**
	 * @public
	 * @method hasString
	 * @param {string}id
	 * @param {string}locale
	 * @returns {boolean}
	 */
	public hasString(id:string, locale:string = null)
	{
		if (locale == null)
		{
			locale = this._locale;
		}

		return (this.hasLocale(locale) && typeof this._strings[locale][id] !== 'undefined');
	}

	/**
	 * @public
	 * @method getStrings
	 * @returns {string[]}
	 */
	public getStrings():string[]
	{
		return this._strings;
	}

	/**
	 * @public
	 * @method addLocaleProvider
	 * @param {ILocaleProvider} provider
	 */
	public addLocaleProvider(provider:ILocaleProvider):void
	{
		this._log.log('addLocaleProvider', provider);

		this._providers.push(provider);
		this.checkProviders(this._locale);
	}

	/**
	 * @public
	 * @method checkProviders
	 * @param {string} locale
	 */
	private checkProviders(locale:string):void
	{
		this._log.log('checkProviders', locale);

		for (var i = 0; i < this._providers.length; i++)
		{
			var provider = this._providers[i];

			if (provider.hasLocale(locale) && !provider.hasProvided(locale))
			{
				provider.provide(locale);
			}
		}
	}

	/**
	 * @public
	 * @method update
	 */
	public update():void
	{
		if (this.isReady())
		{
			this.dispatchEvent(new CommonEvent(CommonEvent.UPDATE));
		}
	}

	/**
	 * @public
	 * @method isReady
	 * @returns {boolean}
	 */
	public isReady():boolean
	{
		if (this._locale == 'debug')
		{
			return true;
		}

		for (var i = 0; i < this._providers.length; i++)
		{
			var provider = this._providers[i];

			if (provider.hasLocale(this._locale) && !provider.hasProvided(this._locale))
			{
				return false;
			}
		}

		return true;
	}
}

export default LocaleManager;