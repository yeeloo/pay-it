import AbstractExternalLocaleProvider from "lib/temple/locale/provider/core/AbstractExternalLocaleProvider";
import LocaleData from "lib/temple/locale/provider/core/data/LocaleData";
import LocaleManager from "lib/temple/locale/LocaleManager";

/**
 * @module Temple
 * @namespace temple.locale.provider.core
 * @extend temple.locale.provider.core.AbstractExternalLocaleProvider
 * @class AbstractJSONLocaleProvider
 */
class AbstractJSONLocaleProvider extends AbstractExternalLocaleProvider
{
	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager, locale, url);
	}

	/**
	 * Parse the JSON data
	 *
	 * @public
	 * @method parseLocaleFile
	 * @param {any} data
	 * @param {string} locale
	 * @param {string} path
	 */
	public parseLocaleFile(data:any, locale:string, path:string = null)
	{
		var separator = '.';

		for(var item in data)
		{
			if(data.hasOwnProperty(item))
			{
				var currentPath = (path ? path + separator + item : item);

				if(typeof data[item] === 'string' || typeof data[item] === 'number' || typeof data[item] === 'boolean')
				{
					this.localeManager.setString(locale, currentPath, data[item]);
				}
				else
				{
					this.parseLocaleFile(data[item], locale, currentPath);

					this.localeManager.setKeys(locale, currentPath, Object.keys(data[item]));
				}
			}
		}
	}
}

export default AbstractJSONLocaleProvider;
