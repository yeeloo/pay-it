import AbstractExternalLocaleProvider from "lib/temple/locale/provider/core/AbstractExternalLocaleProvider";
import LocaleData from "lib/temple/locale/provider/core/data/LocaleData";
import LocaleManager from "lib/temple/locale/LocaleManager";

/**
 * @module Temple
 * @namespace temple.locale.provider.core
 * @extend temple.locale.provider.core.AbstractExternalLocaleProvider
 * @class AbstractXMLLocaleProvider
 */
class AbstractXMLLocaleProvider extends AbstractExternalLocaleProvider
{
	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager, locale, url);
	}

	/**
	 * Parse the XML Data
	 *
	 * @public
	 * @method parseLocaleFile
	 * @param {any} data
	 * @param {string} locale
	 * @param {string} path
	 */
	public parseLocaleFile(data:any, locale:string, path:string = null)
	{
		$(data).find('text').each((i:number, e:HTMLElement) =>
		{
			this.localeManager.setString(locale, $(e).attr('id'), $(e).text());
		});
	}
}

export default AbstractXMLLocaleProvider;