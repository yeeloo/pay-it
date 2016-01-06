import IGatewayOptions from "../IGatewayOptions";

/**
 * Before a request is executed, the action, data and options as are run through this format function so they can be adjusted according to the API endpoints requirements.
 *
 * @class IOutputHandler
 */
interface IOutputHandler
{
	/**
	 * Formats the request.
	 *
	 * @method format
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayOptions} options
	 */
	format(action:string, data:any, options:IGatewayOptions):any;
}

export default IOutputHandler;