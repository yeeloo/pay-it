/**
 * @class Birthdate
 * @namespace temple.utils
 */
class Birthdate
{
	/**
	 * Integer value representing the year. Values from 0 to 99 map to the years 1900 to 1999.
	 *
	 * @property year
	 * @type number
	 */
	public year:number;

	/**
	 * Integer value representing the month, beginning with 1 for January to 12 for December.
	 *
	 * @property month
	 * @type number
	 */
	public month:number;

	/**
	 * Integer value representing the day of the month.
	 *
	 * @property day
	 * @type number
	 */
	public day:number;

	/**
	 * Birthday helper class.
	 *
	 * Contructor accepts:
	 *
	 * - year:number, month:number, day:number
	 * - value:string
	 * - timestamp:number
	 * - date:Date
	 * - yearValueTimestampOrDate:any, month?:number, day?:number
	 *
	 * @constructor
	 * @param {any} yearValueTimestampOrDate
	 * @param {number} [month]
	 * @param {number} [day]
	 * @class Birthdate
	 */
	constructor(year:number, month:number, day:number);
	constructor(value:string);
	constructor(timestamp:number);
	constructor(date:Date);
	constructor(yearValueTimestampOrDate:any, month?:number, day?:number)
	{
		if (!isNaN(month) && !isNaN(day))
		{
			this.year = yearValueTimestampOrDate;
			this.month = month + 1;
			this.day = day;
		}
		else
		{
			this.parse(yearValueTimestampOrDate);
		}
	}

	/**
	 * Parse value to birthdate.
	 *
	 * @method parse
	 * @param {any} value The value to parse.
	 * @return {void}
	 **/
	public parse(value:any):void
	{
		this.fromDate(value instanceof Date ? value : new Date(value));
	}

	/**
	 * Convert Birthday to Date.
	 *
	 * @method toDate
	 * @return {Date}
	 **/
	public toDate():Date
	{
		return new Date(this.year, this.month - 1, this.day);
	}

	/**
	 * Convert Date to Birthdate.
	 *
	 * @method fromDate
	 * @param {Date} date The date to convert.
	 * @return {void}
	 **/
	public fromDate(date:Date):void
	{
		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
		this.day = date.getDate();
	}

	/**
	 * Convert Birthdate to JSON.
	 *
	 * @method toJSON
	 * @return {string}
	 **/
	public toJSON():string
	{
		return this.toString();
	}

	/**
	 * Convert Birthdate to string.
	 *
	 * @method toString
	 * @return {string}
	 **/
	public toString():string
	{
		return (this.year < 100 ? "19" : "") + (this.year < 10 ? "0" : "") + this.year + "-" + (this.month < 10 ? "0" : "") + this.month + "-" + (this.day < 10 ? "0" : "") + this.day;
	}
}

export default Birthdate;