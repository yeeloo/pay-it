import IInputHandler from "./IInputHandler";
import IGatewayOptions from "../IGatewayOptions";

/**
 * @class RESTInputHandler
 */
class RESTInputHandler implements IInputHandler
{
	/**
	 * The RestInputHandler follows the spec, so no formatting is needed.
	 *
	 * @method format
	 * @param {any} data
	 * @returns {any} data
	 */
	public format(data:any):any
	{
		return data;
	}
}

export default RESTInputHandler;