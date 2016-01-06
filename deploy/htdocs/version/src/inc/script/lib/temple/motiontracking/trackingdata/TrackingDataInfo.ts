import TrackingData from "./TrackingData";

/**
 * @author Arjan van Wijk (arjan [at] mediamonks [dot] com)
 * @namespace temple.motiontracking.trackingdata
 * @class TrackingDataInfo
 */
class TrackingDataInfo
{
	public id:string;
	public firstFrame:number;
	public data:TrackingData;

	/**
	 * TrackingDataInfo
	 *
	 * @class TrackingDataInfo
	 * @constructor
	 * @param {string} id
	 * @param {number} firstFrame
	 */
	constructor(id:string, firstFrame:number)
	{
		this.id = id;
		this.firstFrame = firstFrame;
	}

}

export default TrackingDataInfo;