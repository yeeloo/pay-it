import refdef from "def/ReferenceDefinitions";

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
interface IGatewayOptions extends JQueryAjaxSettings
{
	/**
	 * Default cache duration for internal caching in seconds. This can be set globally or (overwritten) per request. This only works for GET requests.
	 * @attribute {number} cacheMaxAge
	 */
	cacheMaxAge?: number;

	/**
	 * Handles how the output data is formatted.
	 * @attribute {IOutputHandler} outputHandler
	 */
	outputHandler?:IOutputHandler;

	/**
	 * Handles how the input data is formatted.
	 * @attribute {IInputHandler} inputHandler
	 */
	inputHandler?:IInputHandler;
}

export default IGatewayOptions;