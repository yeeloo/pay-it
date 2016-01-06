/**
 * Holds a JSON encoded version of the response, that is cached internally until it expires.
 *
 * @class CachedCall
 */
class CachedCall
{
	private _createdAt:number;

	/**
	 * @constructor
	 * @class CachedCall
	 * @param {string} key
	 * @param {any} result
	 * @param {number} maxAge In Seconds
	 */
	constructor(public key:string, public result:any, public maxAge:number = 60)
	{
		this._createdAt = +new Date();
	}

	/**
	 * The current age of the saved data
	 *
	 * @method getAge
	 * @returns {number}
	 */
	public getAge():number
	{
		return ((+new Date()) - this._createdAt) / 1000;
	}

	/**
	 * Checks if the call is expired by comparing the age with the max-age of the data.
	 *
	 * @method isExpired
	 * @returns {boolean}
	 */
	public isExpired():boolean
	{
		return this.maxAge != Number.POSITIVE_INFINITY && this.getAge() > this.maxAge;
	}
}

export default CachedCall;