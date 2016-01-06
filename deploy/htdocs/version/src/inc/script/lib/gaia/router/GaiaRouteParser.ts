/**
 * @namespace gaia.router
 * @class GaiaRouteParser
 */
class GaiaRouteParser
{
	/**
	 * @class GaiaRouteParser
	 * @constructor
	 * @param {string} name
	 * @param {Function} callback
	 */
	constructor(public name:string, public callback:(param:string) => any)
	{

	}
}

export default GaiaRouteParser;