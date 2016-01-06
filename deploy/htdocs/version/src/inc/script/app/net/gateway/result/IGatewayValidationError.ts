import IGatewayError from "./IGatewayError";
import IGatewayValidationFieldError from "./IGatewayValidationFieldError";

/**
 * Returned in the catch() for a failed API request with validation errors.
 *
 * @class IGatewayValidationError
 * @extends IGatewayError
 */
interface IGatewayValidationError extends IGatewayError
{
	/**
	 * Holder for error data, with a code and message and fields.
	 * @attribute {Error} error
	 */
	error: {
		code:string;
		message:string;
		fields:Array<IGatewayValidationFieldError>;
	};
}

export default IGatewayValidationError;