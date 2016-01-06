/**
 * @namespace gaia.router
 * @class GaiaRouteStringifier
 */
class GaiaRouteStringifier
{
	/**
	 * @class GaiaRouteStringifier
	 * @constructor
	 * @param {string} name
	 * @param {Function} callback
	 */
	constructor(public name:string, public callback:(param:any) => string)
	{

	}
}

export default GaiaRouteStringifier;