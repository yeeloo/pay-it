import IGatewayOptions from "../IGatewayOptions";

/**
 * When a request is completed, the data is run trough this format function before it is passed to the user.
 *
 * In here, you can format the data so that is follows the {{#crossLink "IGatewayResult"}}{{/crossLink}} or {{#crossLink "IGatewayError"}}{{/crossLink}} interfaces.
 *
 * @class IInputHandler
 */
interface IInputHandler
{
	/**
	 * Formats the response.
	 *
	 * @method format
	 * @param {any} data
	 * @return {any} data
	 */
	format(data:any):any;
}

export default IInputHandler;