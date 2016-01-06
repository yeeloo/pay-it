/**
 * GeomUtils
 *
 * @module Temple
 * @namespace temple.utils
 * @class GeomUtils
 * @author Thijs Broerse
 */
class GeomUtils
{
	/**
	 * @property RAD2DEG
	 * @static
	 * @type number
	 */
	public static RAD2DEG:number = 180 / Math.PI;

	/**
	 * @property DEG2RAD
	 * @static
	 * @type number
	 */
	public static DEG2RAD:number = Math.PI / 180;

	/**
	 * Converts an angle from radians to degrees.
	 *
	 * __WARNING: this is MUCH slower than the actual calculation : "radians / Math.PI * 180"__
	 *
	 * @static
	 * @method radiansToDegrees
	 * @param {number} radians The angle in radians
	 * @return The angle in degrees
	 */
	public static radiansToDegrees(radians:number):number
	{
		return radians * GeomUtils.RAD2DEG;
	}

	/**
	 * Converts an angle from degrees to radians.
	 *
	 * __WARNING: this is MUCH slower than the actual calculation : "degrees / 180 * Math.PI"__
	 *
	 * @static
	 * @method degreesToRadians
	 * @param {number} degrees The angle in degrees
	 * @return {number} The angle in radians
	 */
	public static degreesToRadians(degrees:number):number
	{
		return degrees * GeomUtils.DEG2RAD;
	}
}

export  = GeomUtils;