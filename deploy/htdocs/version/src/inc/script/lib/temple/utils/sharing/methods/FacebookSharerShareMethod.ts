import {IShareMethod, IShareMethodOptions} from "../ShareUtil";

/**
 * Shares an url using Facebook's (officially deprecated) sharer.php
 *
 * @author Floris Bernard
 * @class FacebookSharerShareMethod
 * @namespace temple.utils.sharing.methods.FacebookSharerShareMethod
 */
export class FacebookSharerShareMethod implements IShareMethod<IFacebookSharerShareMethodOptions> {
	/**
	 * URL to the sharer.php api
	 */
	public static SHARER_API_URL:string = 'https://www.facebook.com/sharer/sharer.php';
	/**
	 * Default height of the popup window with the share dialog.
	 */
	public static DEFAULT_WINDOW_HEIGHT:number = 450;
	/**
	 * Default width of the popup window with the share dialog.
	 */
	public static DEFAULT_WINDOW_WIDTH:number = 690;
	/**
	 * Name for this sharing method
	 */
	public name:string = 'Facebook sharer.php';
	/**
	 * Unique ID for this sharing method
	 */
	public id:string = 'facebook';

	/**
	 * Opens an window sharing a url with the facebook sharer.php api. If no URL is provided,
	 * fallback to the current window.location.href.
	 * @param options An object containing options for the Facebook share. See the
	 * IFacebookSharerShareMethodOptions interface for detailed information on each parameter.
	 * @returns {boolean} Returns true if a sharing window was opened.
	 */
	public share(options:IFacebookSharerShareMethodOptions):boolean
	{
		var url = options.url || window.location.href;

		var width = options.window_width || FacebookSharerShareMethod.DEFAULT_WINDOW_WIDTH;
		var height = options.window_height || FacebookSharerShareMethod.DEFAULT_WINDOW_HEIGHT;

		window.open(FacebookSharerShareMethod.SHARER_API_URL + '?u=' + encodeURIComponent(url),
				'facebook-sharer', `toolbar=0,status=0,width=${width},height=${height}`);

		return true;
	}

}

/**
 * Interface of parameters that can be passed to the Facebook sharer.
 */
export interface IFacebookSharerShareMethodOptions extends IShareMethodOptions {
	/**
	 * The width of the popup window that opens for the Facebook share. Defaults to 690.
	 */
	window_width? : number;
	/**
	 * The height of the popup window that opens for the Facebook share. Defaults to 450.
	 */
	window_height? : number;
}

export default FacebookSharerShareMethod;