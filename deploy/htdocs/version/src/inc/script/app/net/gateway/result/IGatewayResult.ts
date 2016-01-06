import IPagination from "./IPagination";

/**
 * Returned in the then() for a successful API request.
 *
 * @class IGatewayResult<T>
 */
interface IGatewayResult<T>
{
	/**
	 * Optional HTTP Status Code that is added in the request body for clients that cannot handle >= 400 status codes.
	 * @attribute {number} statusCode
	 */
	statusCode?:number;

	/**
	 * The requested data.
	 * @attribute {T} data
	 */
	data?:T;

	/**
	 * Optional pagination metadata for paginated calls.
	 * @attribute {IPagination} pagination
	 */
	pagination?:IPagination;
}

export default IGatewayResult;