import IInputHandler from "./IInputHandler";
import IGatewayOptions from "../IGatewayOptions";

import IGatewayResult from "../result/IGatewayResult";
import IGatewayError from "../result/IGatewayError";
import IGatewayValidationError from "../result/IGatewayValidationError";

/**
 * Maps the current 'legacy' gateway to the new spec, so the new interfaces can be used in all other places.
 *
 * @class LegacyInputHandler
 */
class LegacyInputHandler implements IInputHandler
{
	/**
	 * @method format
	 * @param {any} data
	 * @returns {any} data
	 */
	public format(data:any):any
	{
		if (data.success)
		{
			delete data.success;

			// todo: map pagination according to IPagination
			// we don't have specs in the legacy setup, so should be converted per project

			return <IGatewayResult<any>>data;
		}
		else
		{
			// todo: map validation according to IGatewayValidationError
			// we don't have specs in the legacy setup, so should be converted per project

			return <IGatewayError>{
				error: {
					code: data.code,
					message: data.message
				}
			};
		}
	}
}

export default LegacyInputHandler;