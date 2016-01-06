import AbstractJSONLocaleProvider from "lib/temple/locale/provider/core/AbstractJSONLocaleProvider";
import ILocaleData from "./core/interface/ILocaleData";
import LocaleManager from "lib/temple/locale/LocaleManager";

/**
 * ##Locale provider for JSON documents
 * The JSON object should be as follows:
 *
 *     {
 *         'string_id': 'value',
 *         'other_string_id': 'other value',
 *         'nested_object': {
 *             'nested_string_id': 'this string is nested',
 *             'nested_string_id_2': 'this string is also nested',
 *             'nested_object_2': {
 *                 'nested_string_id': 'this string is nested',
 *                 'nested_string_id_2': 'this string is also nested',
 *              }
 *          }
 *     }
 *
 *  Nested strings should be fetched by their path, separated by a dot ('.'), e.g.:
 *  nested_object.nested_object_2.nested_string_id
 *
 *  Run the grunt create-jsonp task to generate the JSONP file
 *
 * @module Temple
 * @namespace temple.locale.provider
 * @extend temple.locale.provider.core.AbstractJSONLocaleProvider
 * @class JSONPLocaleProvider
 */
class JSONPLocaleProvider extends AbstractJSONLocaleProvider
{
	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager, locale, url);
	}

	/**
	 * @public
	 * @method loadLocalesFromQueue
	 * @param {ILocaleData} json
	 */
	public loadLocaleFromQueue(json:ILocaleData):void
	{
		$.ajax({
			url: json.url,
			jsonpCallback: json.locale,
			crossDomain: true,
			dataType: "jsonp",
			success: (data)=>
			{
				json.loaded = true;
				json.data = data;

				this.parseLocaleFile(data, json.locale);

				// Checks for next in line and recalls the function
				super.loadLocaleFromQueue(json);
			}
		});
	}
}

export default JSONPLocaleProvider;