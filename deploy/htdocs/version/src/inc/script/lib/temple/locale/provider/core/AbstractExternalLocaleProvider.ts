import AbstractLocaleProvider from "lib/temple/locale/provider/core/AbstractLocaleProvider";
import ILocaleData from "lib/temple/locale/provider/core/interface/ILocaleData";
import LocaleData from "lib/temple/locale/provider/core/data/LocaleData";
import LocaleManager from "lib/temple/locale/LocaleManager";
import Log from "../../../utils/Log";

let _log:Log = new Log('lib.temple.locale.provider.core.AbstractExternalLocaleProvider');

/**
 * @module Temple
 * @namespace temple.locale.provider.core
 * @extend temple.locale.provider.core.AbstractLocaleProvider
 * @class AbstractExternalLocaleProvider
 */
class AbstractExternalLocaleProvider extends AbstractLocaleProvider
{
	public files:Array<ILocaleData> = [];
	private _preloadQueue:Array<ILocaleData> = [];

	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager);

		if(locale && url)
		{
			this.addLocaleFile(locale, url);
		}
	}

	/**
	 * Provide the locale
	 *
	 * @public
	 * @method provide
	 * @param {string} locale
	 */
	public provide(locale:string):void
	{
		if(!this.files)
		{
			return;
		}

		for(var i = 0; i < this.files.length; i++)
		{
			var files = this.files[i];

			if(files.locale == locale && !files.loaded)
			{
				this.loadLocaleFile(files);
			}
		}
	}

	/**
	 * Checks if the locale exists and is loaded
	 *
	 * @public
	 * @method hasProvided
	 * @param {string} locale
	 * @returns {boolean}
	 */
	public hasProvided(locale:string):boolean
	{
		if(!this.hasLocale(locale))
		{
			return false;
		}

		for(var i = 0; i < this.files.length; i++)
		{
			var file = this.files[i];

			if(file.locale == locale && !file.loaded)
			{
				return false;
			}
		}

		return true;
	}

	/**
	 * Checks if the locale exists
	 *
	 * @public
	 * @method hasLocale
	 * @param {string} locale
	 * @returns {boolean}
	 */
	public hasLocale(locale:string):boolean
	{
		if(!this.files)
		{
			return false;
		}

		for(var i = 0; i < this.files.length; i++)
		{
			var file = this.files[i];

			if(file.locale == locale)
			{
				return true;
			}
		}

		return false;
	}

	/**
	 * Retuns all the locales
	 *
	 * @public
	 * @method getLocales
	 * @returns {ILocaleData[]}
	 */
	public getLocales():ILocaleData[]
	{
		if(!this.files)
		{
			return [];
		}

		var list:any[] = [];

		for(var i = 0; i < this.files.length; i++)
		{
			var file = this.files[i];

			if(list.indexOf(file.locale) == -1)
			{
				list.push(file.locale);
			}
		}

		return list;
	}


	/**
	 * Add a file to the LocaleManager.
	 * Before adding the file to the LocaleProvider checks if file is already added (so it won't be added twice)
	 *
	 * @public
	 * @method addLocaleFile
	 * @param {string} locale
	 * @param {string} url
	 * @param {boolean} preload
	 */
	public addLocaleFile(locale:string, url:string, preload:boolean = false):void
	{
		_log.log('addLocaleFile(', locale, url, preload, ')');

		if(this.findLocaleData(locale, null, url))
		{
			return;
		}

		var localeData = new LocaleData(locale, null, url);
		this.files.push(localeData);

		if(locale == this.localeManager.getLocale() || preload)
		{
			this.loadLocaleFile(localeData);
		}
	}

	/**
	 * Adds new locale objects to a preload queue
	 *
	 * @public
	 * @method loadLocaleFile
	 * @param {ILocaleData} fileData
	 */
	public loadLocaleFile(fileData:ILocaleData):void
	{
		if(!this.checkIfLocaleAlreadyAddedToQueue(fileData.locale) && !this.hasProvided(fileData.locale))
		{
			this._preloadQueue.push(fileData);

			if(this._preloadQueue.length === 1)
			{
				this.loadLocaleFromQueue(fileData);
			}
		}
	}

	/**
	 * Check if the locale was already added to the queue
	 *
	 * @public
	 * @method checkIfLocaleAlreadyAddedToQueue
	 * @param {string}locale
	 * @returns {boolean}
	 */
	public checkIfLocaleAlreadyAddedToQueue(locale:string):boolean
	{
		for(var i = 0; i < this._preloadQueue.length; i++)
		{
			if(locale === this._preloadQueue[i].locale)
			{
				return true;
			}
		}

		return false;
	}

	/**
	 * Should do the actual XHR Request in the parent class,
	 * after completion run the super call to parse the response and load the next in queue
	 *
	 * @public
	 * @method loadLocaleFromQueue
	 * @param fileData
	 */
	public loadLocaleFromQueue(fileData:ILocaleData):void
	{
		this.parseLocaleFile(fileData.data, fileData.locale);

		this.localeManager.update();

		// Load the next one in the queue
		this._preloadQueue.splice(0, 1);
		if(this._preloadQueue.length)
		{
			this.loadLocaleFromQueue(<ILocaleData>this._preloadQueue[0]);
		}
	}

	/**
	 * Returns the file data
	 *
	 * @public
	 * @method findLocaleData
	 * @param {string} locale
	 * @param {string} name
	 * @param {string} url
	 * @returns {ILocaleData}
	 */
	public findLocaleData(locale:string, name:string, url:string):ILocaleData
	{
		_log.log('findLocaleData(', locale, name, url, ')');

		for(var i = 0; i < this.files.length; i++)
		{
			var file = this.files[i];

			if(file.locale == locale && file.name == name && file.url == url)
			{
				return file;
			}
		}

		return null;
	}

	/**
	 * Parse the File Data, should be overwritten for the xml and json providers
	 *
	 * @public
	 * @method parseLocaleFile
	 * @param {any} data
	 * @param {string} locale
	 * @param {string} path
	 */
	public parseLocaleFile(data:any, locale:string, path:string = null)
	{
		_log.error('Abstract class, please extend and override this method');
	}

	/**
	 * @public
	 * @method destruct
	 */
	public destruct():void
	{
		this.files = null;
		this._preloadQueue = null;

		super.destruct();
	}
}

export default AbstractExternalLocaleProvider;