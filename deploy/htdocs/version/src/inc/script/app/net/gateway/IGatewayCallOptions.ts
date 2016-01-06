import refdef from "def/ReferenceDefinitions";

import IGatewayOptions from "./IGatewayOptions";
import IOutputHandler from "./output/IOutputHandler";
import IInputHandler from "./input/IInputHandler";

/**
 * Options that can be passed to the Gateway constructor for global settings, or to individual requests.
 *
 * This extends the default jQuery ajax settings.
 *
 * @class IGatewayOptions
 * @extends JQueryAjaxSettings
 */
interface IGatewayCallOptions extends IGatewayOptions
{

	/**
	 * Specify a key to make the request unique, so the results can be properly cached. This only works for GET requests.
	 * Defaults to options.jsonpCallback || (options.url + action + base64(data))
	 *
	 * @attribute {string} cacheKey
	 */
	cacheKey?: string;
}

export default IGatewayCallOptions;