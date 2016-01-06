import AbstractXMLLocaleProvider from "lib/temple/locale/provider/core/AbstractXMLLocaleProvider";
import ILocaleData from "./core/interface/ILocaleData";
import LocaleManager from "lib/temple/locale/LocaleManager";
import Browser from "lib/temple/utils/Browser";

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
 * Run the grunt create-xmlp task to generate the XMLP file
 *
 * XMLLocaleProvider
 *
 * @module Temple
 * @namespace temple.locale.provider
 * @extend temple.locale.provider.core.AbstractXMLLocaleProvider
 * @class XMLLocaleProvider
 */
class XMLPLocaleProvider extends AbstractXMLLocaleProvider
{
	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager, locale, url);
	}

	/**
	 * Does the actual XHR Request
	 *
	 * @public
	 * @method loadLocaleFromQueue
	 * @param {ILocaleData} xml
	 */
	public loadLocaleFromQueue(xml:ILocaleData):void
	{
		$.ajax({
			url: xml.url,
			jsonpCallback: xml.locale,
			crossDomain: true,
			dataType: "jsonp",
			success: (data)=>
			{
				xml.loaded = true;
				xml.data = this.parseResponseText(data);

				this.parseLocaleFile(xml.data, xml.locale);

				// Checks for next in line and recalls the function
				super.loadLocaleFromQueue(xml);
			}
		});
	}

	/**
	 * IE8 does not support the DOM Parser so added a fix, might not be needed
	 * because of the dropped IE8 support
	 */
	public parseResponseText(data:string):Document
	{
		var parsedResponse:string = decodeURIComponent(data);
		var xmlData:any;

		if(Browser.ie && Browser.version < 9)
		{
			xmlData = new ActiveXObject("Microsoft.XMLDOM");
			xmlData.async = false;
			return xmlData.loadXML(parsedResponse);
		}
		else
		{
			var parser = new DOMParser();
			return parser.parseFromString(parsedResponse, "text/xml");
		}
	}
}

export default XMLPLocaleProvider;