/**
 * @author Bart (bart[at]mediamonks.com)
 * @module Temple
 * @namespace temple.utils
 * @class MinMax
 *
 */
class MinMax
{
	private _min:number = 0;
	private _max:number = 1;
	private _range:number = 1;

	/**
	 * Lazy min/max number values util (easy randomizer/limiter etc).
	 *
	 * @class MinMax
	 * @param {number} [min=0] The minimum value.
	 * @param {string} [max=1] The maximum value.
	 * @constructor
	 */
	constructor(min:number = 0, max:number = 1)
	{
		this._min = min;
		this._max = max;
		this.order();
	}

	/**
	 * Get a random value betweem min and max.
	 *
	 * @method getRandom
	 * @return {number}
	 **/
	public getRandom():number
	{
		return this._range * Math.random() + this._min;
	}

	/**
	 * Get the difference between min and max.
	 *
	 * @method getRange
	 * @return {number}
	 **/
	public getRange():number
	{
		return this._range;
	}

	/**
	 * Get the center value between min and max.
	 *
	 * @method getCenter
	 * @return {number}
	 **/
	public getCenter():number
	{
		return this._range / 2 + this._min;
	}

	/**
	 * Get the min value.
	 *
	 * @method getMin
	 * @return {number}
	 **/
	public getMin():number
	{
		return this._min;
	}

	/**
	 * Set the min value.
	 *
	 * @method setMin
	 * @param {number} value The minimum value.
	 * @return {void}
	 **/
	public setMin(value:number):void
	{
		this._min = value;
		this.order();
	}

	/**
	 * Get the max value.
	 *
	 * @method getMax
	 * @return {number}
	 **/
	public getMax():number
	{
		return this._max;
	}

	/**
	 * Set the max value.
	 *
	 * @method setMax
	 * @param {number} value The maximum value.
	 * @return {void}
	 **/
	public setMax(value:number):void
	{
		this._max = value;
		this.order();
	}

	/**
	 * Limit a value between min and max.
	 *
	 * @method limit
	 * @param {number} value The value limit.
	 * @return {number}
	 **/
	public limit(value:number):number //translate into a limited number
	{
		if(value < this._min)
		{
			value = this._min;
		}
		else if(value > this._max)
		{
			value = this._max;
		}
		return value;
	}

	/**
	 * Check if value is between min and max.
	 *
	 * @method contains
	 * @param {number} value The value to check.
	 * @return {boolean}
	 **/
	public contains(value:number):boolean //check
	{
		if(value < this._min || value > this._max)
		{
			return false;
		}
		return true;
	}

	private order():void //basic limiting
	{
		if(this._min > this._max)
		{
			var tmp:number = this._min;
			this._min = this._max;
			this._max = tmp;
		}
		this._range = this._max - this._min; //always do this
	}
}

export default MinMax;