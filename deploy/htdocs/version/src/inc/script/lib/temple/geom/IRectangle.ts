import IPoint from "lib/temple/geom/IPoint";

/**
 * Definition of a rectangle with an origin
 *
 * @class IRectangle
 * @namespace temple.geom
 * @extends temple.geom.IPoint
 */
interface IRectangle extends IPoint
{
	/**
	 * @property width {number}
	 */
	width:number;

	/**
	 * @property height {number}
	 */
	height:number;
}

export default IRectangle;