/**
 * Returned in the catch() for a failed API request.
 *
 * @class IGatewayError
 */
interface IGatewayError
{
	/**
	 * Optional HTTP Status Code that is added in the request body for clients that cannot handle >= 400 status codes.
	 * @attribute {number} statusCode
	 */
	statusCode?:number;

	/**
	 * Holder for error data, with a code and message
	 * @attribute {Error} error
	 */
	error: {
		code:string;
		message:string;
	}
}

export default IGatewayError;