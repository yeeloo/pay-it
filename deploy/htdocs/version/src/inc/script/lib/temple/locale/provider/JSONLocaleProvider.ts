import AbstractJSONLocaleProvider from "./core/AbstractJSONLocaleProvider";
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
 * @module Temple
 * @namespace temple.locale.provider
 * @extend temple.locale.provider.core.AbstractJSONLocaleProvider
 * @class JSONLocaleProvider
 */
class JSONLocaleProvider extends AbstractJSONLocaleProvider
{
	constructor(localeManager:LocaleManager, locale:string = null, url:string = null)
	{
		super(localeManager, locale, url);
	}

	/**
	 * @public
	 * @method loadLocaleFromQueue
	 * @param {ILocaleData} json
	 */
	public loadLocaleFromQueue(json:ILocaleData):void
	{
		$.getJSON(json.url, (data) =>
		{
			json.loaded = true;
			json.data = data;

			// Checks for next in line and recalls the function
			super.loadLocaleFromQueue(json);
		});
	}
}

export default JSONLocaleProvider;