import Log from "../../temple/utils/Log";
/**
 * @namespace gaia.router
 * @class GaiaRouteRequirement
 */
class GaiaRouteRequirement
{
	constructor(name:string, assertion:string);
	constructor(name:string, assertion:RegExp);
	constructor(name:string, assertion:(value:string) => boolean);
	constructor(public name:string, public assertion:any)
	{
		var check:string = '';


		if (typeof this.assertion !== 'function')
		{
			check = this.assertion.toString();
		}

		if (check)
		{
			if (check.charAt(0) != '^')
			{
				Log.warn('Gaia.Router.RouteRequirement', 'Missing ^ at the beginning, this might be unintential.', name, this.assertion);
			}
			if (this.assertion.charAt(this.assertion.length - 1) != '$')
			{
				Log.warn('Gaia.Router.RouteRequirement', 'Missing $ at the end, this might be unintential.', name, this.assertion);
			}
		}
	}

	/**
	 * @method assert
	 * @param {string} value
	 * @returns {boolean}
	 */
	public assert(value:string):boolean;
	public assert(value:Function):boolean;
	public assert(value:RegExp):boolean;
	public assert(value:any):boolean
	{
		// string
		if (typeof this.assertion === 'string')
		{
			return new RegExp(this.assertion, 'i').test(value);
		}
		// function
		else if (typeof this.assertion === 'function')
		{
			return this.assertion(value);
		}
		// regexp
		else
		{
			return this.assertion.test(value);
		}
	}
}

export default GaiaRouteRequirement;