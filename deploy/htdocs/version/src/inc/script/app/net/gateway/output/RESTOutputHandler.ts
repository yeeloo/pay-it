import IOutputHandler from "./IOutputHandler";
import IGatewayOptions from "../IGatewayOptions";

/**
 * Formats the data according to the MediaMonks REST API spec, where the action is appended to the base-url.
 *
 * @class RESTOutputHandler
 */
class RESTOutputHandler implements IOutputHandler
{
	/**
	 * @method format
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayOptions} options
	 * @returns {any} data
	 */
	format(action:string, data:any, options:IGatewayOptions):any
	{
		options.url += action;

		return data;
	}
}

export default RESTOutputHandler;