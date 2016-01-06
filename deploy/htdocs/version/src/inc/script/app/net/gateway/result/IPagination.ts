/**
 * Pagination metadata returned for a paginated call.
 *
 * Either cursor or offset based pagination can be used.
 *
 * @class IPagination
 */
interface IPagination
{
	/**
	 * The total amount of records for the un-paginated result set.
	 * @attribute {number} total
	 */
	total:number;

	/**
	 * The limit of results for this request.
	 * @attribute {number} limit
	 */
	limit:number;

	/**
	 * The offset in the record set, used for offset-based pagination.
	 * @attribute {number} offset
	 */
	offset:number;

	/**
	 * The start cursor of the response, can be used for the previous page when using cursor-based pagination.
	 * @attribute {any} since
	 */
	since:any;

	/**
	 * The end cursor of the response, can be used for the next page when using cursor-based pagination.
	 * @attribute {any} until
	 */
	until:any;
}

export default IPagination;