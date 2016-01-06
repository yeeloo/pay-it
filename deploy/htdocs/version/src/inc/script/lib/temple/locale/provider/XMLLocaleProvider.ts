import AbstractXMLLocaleProvider from "lib/temple/locale/provider/core/AbstractXMLLocaleProvider";
import ILocaleData from "./core/interface/ILocaleData";
import LocaleManager from "lib/temple/locale/LocaleManager";

/**
 * Locale provider for XML documents
 * The XML document should be formatted as follows:
 *
 *     <?xml version="1.0" encoding="UTF-8"?>
 *     <texts>
 *         <text id="string_id_2"><![CDATA[This is string #2]]></text>
 *         <text id="string_id_1"><![CDATA[This is string #1]]></text>
 *         <text id="string_id_3"><![CDATA[This is string #3. You can also use <strong>HTML</strong> here!]]></text>
 *     </texts>
 *
 * XMLPLocaleProvider
 *
 * @module Temple
 * @namespace temple.locale.provider
 * @extend temple.locale.provider.core.AbstractXMLLocaleProvider
 * @class XMLPLocaleProvider
 */
class XMLLocaleProvider extends AbstractXMLLocaleProvider
{
	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager, locale, url);
	}

	/**
	 * Does the actual XHR Request
	 *
	 * @pubilc
	 * @method loadLocaleFromQueue
	 * @param {ILocaleData} xml
	 */
	public loadLocaleFromQueue(xml:ILocaleData):void
	{
		$.get(xml.url, (data) =>
		{
			xml.loaded = true;
			xml.data = data;

			// Checks for next in line and recalls the function
			super.loadLocaleFromQueue(xml);
		});
	}
}

export default XMLLocaleProvider;