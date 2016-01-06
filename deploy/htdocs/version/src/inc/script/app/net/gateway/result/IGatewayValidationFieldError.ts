/**
 * @class IGatewayValidationFieldError
 */
interface IGatewayValidationFieldError
{
	/**
	 * The field in the form where the error is related to.
	 * @attribute {string} field
	 */
	field:string;

	/**
	 * The error code, can be used for UI logic based on the type of error.
	 * @attribute {code} field
	 */
	code:string;

	/**
	 * The error message, always localized, and can be used to display in the form.
	 * @attribute {message} field
	 */
	message:string;
}

export default IGatewayValidationFieldError;