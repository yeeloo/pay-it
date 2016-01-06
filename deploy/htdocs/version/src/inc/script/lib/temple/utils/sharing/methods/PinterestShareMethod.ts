import {IShareMethod, IShareMethodOptions} from "../ShareUtil";

/**
 * Sharing method to create a Pinterest 'pin' for a url, description or image.
 *
 * @author Floris Bernard
 * @class PinterestShareMethod
 * @namespace temple.utils.sharing.methods.PinterestShareMethod
 */
export class PinterestShareMethod implements IShareMethod<IPinterestShareMethodOptions> {
	/**
	 * URL for the Pinterest sharing endpoint
	 */
	public static SHARE_ENDPOINT_URL:string = 'http://pinterest.com/pin/create/link/';
	/**
	 * Default width of the popup window that opens to create the pin in pixels.
	 */
	public static DEFAULT_WINDOW_WIDTH:number = 750;
	/**
	 * Default height of the popup window that opens to create the pin in pixels.
	 */
	public static DEFAULT_WINDOW_HEIGHT:number = 500;
	/**
	 * Name for this sharing method
	 */
	public name:string = 'Pinterest Pin It Sharer';
	/**
	 * Unique ID for this sharing method
	 */
	public id:string = 'pinterest';

	/**
	 * Opens an window for creating a new Pinterest pin. The image parameter is required.
	 * @param options An object containing options for the new pin. See the
	 * IPinterestShareMethodOptions interface for detailed information on each parameter.
	 * @returns {boolean} Returns true if a window.open call was executed.
	 */
	public share(options:IPinterestShareMethodOptions):boolean
	{
		var params:string[] = ['text', 'url', 'image'];
		var paramNames:string[] = ['description', 'url', 'media'];
		var urlParams:string[] = [];

		if(!options.image) {
			console.error('Cannot share to Pinterest. An image url is required when sharing.');
			return false;
		}

		params.forEach((param:string, index:number) =>
		{
			if(typeof options[param] == 'string')
			{
				var paramName = paramNames[index];
				urlParams.push(paramName + '=' + encodeURIComponent(options[param]));
			}
		});

		var width = options.window_width || PinterestShareMethod.DEFAULT_WINDOW_WIDTH;
		var height = options.window_height || PinterestShareMethod.DEFAULT_WINDOW_HEIGHT;

		window.open(PinterestShareMethod.SHARE_ENDPOINT_URL + '?' + urlParams.join('&'),
			'pinterest-pin-it-sharer', `toolbar=0,status=0,width=${width},height=${height}`);

		return true;
	}

}

/**
 * Interface of parameters that can be passed to the Pinterest Pin It endpoint. For more information
 * on each parameter, see the
 * [Pinterest documentation](https://developers.pinterest.com/docs/widgets/pin-it/ "Pinterest Documentation")
 */
export interface IPinterestShareMethodOptions extends IShareMethodOptions {
	/**
	 * Description to use on the new pin.
	 */
	text? : string
	/**
	 * The image to pin. Required in order for sharing to work.
	 */
	image : string;
	/**
	 * The width of the popup window that opens for the pin. Defaults to 750.
	 */
	window_width? : number;
	/**
	 * The height of the popup window that opens for the pin. Defaults to 500.
	 */
	window_height? : number;
}

export default PinterestShareMethod;