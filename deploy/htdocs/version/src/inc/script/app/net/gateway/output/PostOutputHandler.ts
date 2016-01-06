import IOutputHandler from "./IOutputHandler";
import IGatewayOptions from "../IGatewayOptions";

/**
 * Formats the data according to the application/x-www-form-urlencoded spec, and the 'action' field is put in the request body.
 *
 * @class PostOutputHandler
 */
class PostOutputHandler implements IOutputHandler
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
		data['action'] = action;

		return data;
	}
}

export default PostOutputHandler;