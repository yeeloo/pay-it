import MediaElement from './MediaElement';
import Browser from './Browser';

/**
 * Base VideoElement to use as the base class for all videoElement related stuff
 *
 * @namespace temple.utils
 * @class VideoElement
 * @extends temple.utils.MediaElement
 * @author Mient-jan Stelling
 */
class VideoElement extends MediaElement {

	public element:HTMLVideoElement;

	/**
	 * Base VideoElement to use as the base class for all videoElement related stuff
	 *
	 * @class VideoElement
	 * @constructor
	 * @param element [HTMLVideoElement]
	 */
	constructor(element:HTMLVideoElement = null){
		if(element == null){
			// should be replaced with a more abstract version of the video Element.
			element = document.createElement('video');
		}

		super(element);
	}

	/**
	 * Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels.
	 *
	 * @method getWidth
	 * @return number
	 */
	public getWidth():number
	{
		return this.element.width;
	}

	/**
	 *
	 * @property width {number}
	 */
	public get width():number
	{
		return this.getWidth();
	}

	/**
	 * Is a DOMString that reflects the width HTML attribute, which specifies the width of the display area, in CSS pixels.
	 *
	 * @method setWidth
	 * @param width {number}
	 * @return void
	 */
	public setWidth(value:number)
	{
		this.element.width = value;
	}

	/**
	 * @property width {number}
	 */
	public set width(value:number)
	{
		this.setWidth(value);
	}

	/**
	 * Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels.
	 *
	 * @method getHeight
	 * @return number
	 */
	public getHeight():number
	{
		return this.element.height;
	}

	/**
	 * @property height {number}
	 */
	public get height():number
	{
		return this.getHeight();
	}

	/**
	 * Is a DOMString that reflects the height HTML attribute, which specifies the height of the display area, in CSS pixels.
	 *
	 * @method setHeight
	 * @param value {number}
	 * @return void
	 */
	public setHeight(value:number)
	{
		this.element.height = value;
	}

	public set height(value:number)
	{
		this.setHeight(value);
	}

	/**
	 * Returns an unsigned long containing the intrinsic width of the resource in CSS pixels, taking into account the dimensions,
	 * aspect ratio, clean aperture, resolution, and so forth, as defined for the format used by the resource. If the element's
	 * ready state is HAVE_NOTHING, the value is 0.
	 *
	 * @method getVideoWidth
	 * @return number
	 */
	public getVideoWidth():number
	{
		return this.element.videoWidth;
	}

	/**
	 * @property videoWidth {number}
	 */
	public get videoWidth():number
	{
		return this.getVideoWidth();
	}

	/**
	 * Returns an unsigned long containing the intrinsic height of the resource in CSS pixels, taking into account the
	 * dimensions, aspect ratio, clean aperture, resolution, and so forth, as defined for the format used by the resource.
	 * If the element's ready state is HAVE_NOTHING, the value is 0.
	 *
	 * @method getVideoHeight
	 * @return number
	 */
	public getVideoHeight():number
	{
		return this.element.videoHeight;
	}

	/**
	 * @property videoHeight {number}
	 */
	public get videoHeight():number
	{
		return this.element.videoHeight;
	}


	/**
	 * Is a DOMString that reflects the poster HTML attribute, which specifies an image to show while no video data is available.
	 *
	 * @method getPoster
	 * @return string
	 */
	public getPoster():string
	{
		return this.element.poster;
	}

	/**
	 * @property poster {string}
	 */
	public get poster():string
	{
		return this.getPoster();
	}

	/**
	 * Is a DOMString that reflects the poster HTML attribute, which specifies an image to show while no video data is available.
	 *
	 * @method setPoster
	 * @param value {string}
	 * @return void
	 */
	public setPoster(value:string)
	{
		this.element.poster = value;
	}

	public set poster(value:string)
	{
		this.setPoster(value);
	}

	/**
	 * This method is experimental
	 *
	 * @method getVideoPlaybackQuality
	 * @returns {VideoPlaybackQuality}
	 */
	public getVideoPlaybackQuality():VideoPlaybackQuality
	{

		return <VideoPlaybackQuality> this.element['getVideoPlaybackQuality']();
	}
}

export default VideoElement;