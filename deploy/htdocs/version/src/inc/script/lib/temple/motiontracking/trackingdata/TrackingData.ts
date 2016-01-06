import Frame from "./Frame";
import RegExpUtils from "../../utils/types/RegExpUtils";

/**
 *
 * After Effects tracking data example:
 *
 * -------------------------------------
 * Adobe After Effects 8.0 Keyframe Data
 *
 * Units Per Second	25
 * Source Width	100
 * Source Height	100
 * Source Pixel Aspect Ratio	1
 * Comp Pixel Aspect Ratio	1
 *
 * Transform	Position
 *      Frame	X pixels	Y pixels	Z pixels
 *      0	662	233	0
 *      1	660.504	230.727	0
 *      2	660.211	229.105	0
 *      3	663.305	224.5	0
 *
 * End of Keyframe Data
 *
 * Transform	Position
 *      Frame	X pixels	Y pixels	Z pixels
 *      0	662	233	0
 *      1	660.504	230.727	0
 *      2	660.211	229.105	0
 *      3	663.305	224.5	0
 *
 * End of Keyframe Data
 * -------------------------------------
 *
 * Nuke tracking data example:
 *
 * @author Arjan van Wijk (arjan [at] mediamonks [dot] com)
 * @namespace temple.motiontracking.trackingdata
 * @class TrackingData
 *
 */
class TrackingData
{
	private _rawData:string;
	private _sourceSize:{ x:number; y:number; width:number; height:number; };
	private _destinationSize:{ x:number; y:number; width:number; height:number; };
	private _pins:Array<Array<Frame>>;

	/**
	 * Creates a new TrackingData instance and parses the data.
	 * The data gets scaled and offsetted based on the sourceSize and destinationSize.
	 *
	 * @class TrackingData
	 * @constructor
	 *
	 * @param {string} data trackingdata file contents (either AfterEffects or Nuke format)
	 * @param {Rectangle} sourceSize Source dimentions for tracking data
	 * @param {Rectangle} destinationSize Destination dimensions for tracking data
	 */
	constructor(data:string, sourceSize:{ x:number; y:number; width:number; height:number; }, destinationSize:{ x:number; y:number; width:number; height:number; })
	{
		this._rawData = data;
		this._sourceSize = sourceSize;
		this._destinationSize = destinationSize;

		this.parse();
	}

	private parse():void
	{
		if (this._rawData.indexOf('{curve') != -1)
		{
			this.parseNuke();
		}
		else
		{
			this.parseAfterEffects();
		}
	}

	private parseAfterEffects():void
	{
		var regexp:RegExp = /^\s(Frame)|(\d+?)\t(-?[\d\.]+?)\t(-?[\d\.]+?)(?:\t(-?[\d\.]+?))?\s?$/gim;

		// find all frames
		var results:Array<any> = RegExpUtils.pregMatchAll(regexp, this._rawData);

		this._pins = [];
		var pin:Array<Frame>;

		var len:number = results[0].length;
		for (var i:number = 0; i < len; i++)
		{
			// if we find a 'line' that starts with "Frame" we know this is a new pin
			if (results[1][i] == 'Frame')
			{
				// create new pin
				pin = [];
				this._pins.push(pin);
			}
			else
			{
				var frame:Frame = new Frame(results[2][i]);
				frame.x = results[3][i] / this._sourceSize.width * this._destinationSize.width + this._destinationSize.x;
				frame.y = results[4][i] / this._sourceSize.height * this._destinationSize.height + this._destinationSize.y;
				frame.z = results[5][i] * 1;

				// add frame for this pin
				pin.length = frame.frame;
				pin[results[2][i]] = frame;
			}
		}
	}
	
	private parseNuke():void
	{
		var regexp:RegExp = /(curve)|(?:x(\d+))|\s(-?[\d\.]+)/gim;

		// find all frames
		var results:Array<any> = RegExpUtils.pregMatchAll(regexp, this._rawData);

		this._pins = [];
		var pin:Array<Frame>;

		var len:number = results[0].length;
		var keyframe:number = 0;
		var numCurves:number = -1;
		for (var i:number = 0; i < len; i++)
		{
			// if we find a 'curve' a new x/y pin is found
			if (results[1][i] == 'curve')
			{
				++numCurves;

				if (numCurves % 2 == 0)
				{
					// create new pin
					pin = [];
					this._pins.push(pin);
				}

				keyframe = 0;
			}
			// if we find a keyframe marker
			else if (results[2][i])
			{
				keyframe = results[2][i];
			}
			else
			{
				if (numCurves % 2 == 0)
				{
					var frame:Frame = new Frame(keyframe);

					frame.x = results[3][i] / this._sourceSize.width * this._destinationSize.width + this._destinationSize.x;

					// add frame for this pin
					pin.length = frame.frame;
					pin[keyframe] = frame;
				}
				else
				{
					frame = pin[keyframe];

					frame.y = results[3][i] / this._sourceSize.height * this._destinationSize.height;

					// flip nuke coordinates
					frame.y = -frame.y + this._destinationSize.height + this._destinationSize.y;
				}

				++keyframe;
			}
		}
	}

	/**
	 * Gets the number of pins
	 *
	 * @method getNumPins
	 * @returns {number}
	 */
	public getNumPins():number
	{
		return this._pins.length;
	}

	/**
	 * Gets the (max) number of frames
	 *
	 * @method getNumFrames
	 * @returns {number}
	 */
	public getNumFrames():number
	{
		var max:number = 0;
		for (var i:number = 0; i < this._pins.length; ++i)
		{
			max = Math.max(max, this._pins[i].length);
		}
		return max;
	}

	/**
	 * Gets framenumber of the first frame in the trackingdata
	 *
	 * @method getStartFrame
	 * @returns {number}
	 */
	public getStartFrame():number
	{
		var start:number = 0;
		for (var i:number = 0; i < this._pins[0].length; ++i)
		{
			if (!this._pins[0][i])
			{
				start = i + 1;
			}
			else
			{
				break;
			}
		}
		return start;
	}

	/**
	 * Gets the frame data for a given frame from a given pin.
	 *
	 * @method getFrameForPin
	 * @param pinIndex {number} The pin
	 * @param frameIndex {number} The frame number for the pin
	 * @returns {number}
	 */
	public getFrameForPin(pinIndex:number, frameIndex:number):Frame
	{
		if (frameIndex < 0) frameIndex = 0;

		var pin:Array<Frame> = this._pins[pinIndex];

		if (frameIndex in pin) return pin[frameIndex];

		return this.findFrame(pin, frameIndex);
	}

	/**
	 * Fills in framedata for empty frames.
	 *
	 * @method fixEmptyFrames
	 */
	public fixEmptyFrames():void
	{
		for (var i:number = 0; i < this._pins.length; i++)
		{
			for (var j:number = 0; j < this._pins[i].length; j++)
			{
				var pin:Array<Frame> = this._pins[i];

				if (!(j in pin) || !pin[j])
				{
					pin[j] = this.findFrame(pin, j);
					console.info('fix: ' + [i, j]);
				}
			}
		}
	}

	private findFrame(pin:Array<Frame>, frameIndex:number):Frame
	{
		// if there is no frame at this point look for previous frames
		while ((!(frameIndex in pin) || !pin[frameIndex]) && frameIndex > 0)
		{
			--frameIndex;
		}

		// if we have no previous frames, look for next frames
		if (frameIndex == 0 && (!(frameIndex in pin) || !pin[frameIndex]))
		{
			while ((!(frameIndex in pin) || !pin[frameIndex]) && frameIndex < pin.length - 1)
			{
				++frameIndex;
			}
		}

		// if we didn't find any frame in this pin (should never happen)
		if (!(frameIndex in pin))
		{
			return null;
		}

		return pin[frameIndex];
	}
}

export default TrackingData;