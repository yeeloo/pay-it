import IOutputHandler from "./IOutputHandler";
import IGatewayOptions from "../IGatewayOptions";

/**
 * Formats the request according to the Flash Gateway 'multipart/json' spec, where each key is a JSON formatted string.
 *
 * @class JSONOutputHandler
 */
class JSONOutputHandler implements IOutputHandler
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
		for (var key in data)
		{
			if (data.hasOwnProperty(key) && (typeof data[key] === 'object' || typeof data[key] === 'array'))
			{
				data[key] = JSON.stringify(data[key]);
			}
		}

		options.url += (options.url.indexOf('?') != -1 ? '&' : '?') + 'action=' + action;

		return data;
	}

}

export default JSONOutputHandler;