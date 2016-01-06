/**
 * @author Arjan van Wijk (arjan [at] mediamonks [dot] com)
 * @namespace temple.motiontracking.trackingdata
 * @class Frame
 */
class Frame
{
	public frame:number;
	public x:number;
	public y:number;
	public z:number;

	/**
	 * Frame
	 *
	 * @class Frame
	 * @constructor
	 * @param {number} frame
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	constructor (frame:number, x:number = 0, y:number = 0, z:number = 0)
	{
		this.frame = frame;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * @method toString
	 * @returns {string}
	 */
	public toString():String
	{
		return "[Frame (frame=" + this.frame + ", x=" + this.x + ", y=" + this.y + ", z=" + this.z + ")]";
	}
}

export default Frame;