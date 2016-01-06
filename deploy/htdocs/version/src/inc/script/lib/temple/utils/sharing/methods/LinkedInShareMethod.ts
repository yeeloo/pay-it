import {IShareMethod, IShareMethodOptions} from "../ShareUtil";

/**
 * Sharing method to share an 'article' to LinkedIn
 *
 * @author Floris Bernard
 * @class LinkedInShareMethod
 * @namespace temple.utils.sharing.methods.LinkedInShareMethod
 */
export class LinkedInShareMethod implements IShareMethod<ILinkedInShareMethodOptions> {
	/**
	 * URL for the LinkedIn sharing endpoint
	 */
	public static SHARE_ENDPOINT_URL:string = 'https://www.linkedin.com/shareArticle';
	/**
	 * Default width of the popup window that opens to create the article in pixels.
	 */
	public static DEFAULT_WINDOW_WIDTH:number = 520;
	/**
	 * Default height of the popup window that opens to create the article in pixels.
	 */
	public static DEFAULT_WINDOW_HEIGHT:number = 570;
	/**
	 * Name for this sharing method
	 */
	public name:string = 'LinkedIn Article Sharer';
	/**
	 * Unique ID for this sharing method
	 */
	public id:string = 'linkedin';

	/**
	 * Opens an window for creating a new LinkedIn article.
	 * @param options An object containing options for the new article. See the
	 * ILinkedInShareMethodOptions interface for detailed information on each parameter.
	 * @returns {boolean} Returns true if a window.open call was executed.
	 */
	public share(options:ILinkedInShareMethodOptions):boolean
	{
		var url = options.url || window.location.href;
		var params:string[] = ['text', 'title', 'source'];
		var paramNames:string[] = ['summary', 'title', 'source'];
		var urlParams:string[] = ['mini=true', 'url=' + encodeURIComponent(url)];

		params.forEach((param:string, index:number) =>
		{
			if(typeof options[param] == 'string')
			{
				var paramName = paramNames[index];
				urlParams.push(paramName + '=' + encodeURIComponent(options[param]));
			}
		});

		var width = options.window_width || LinkedInShareMethod.DEFAULT_WINDOW_WIDTH;
		var height = options.window_height || LinkedInShareMethod.DEFAULT_WINDOW_HEIGHT;

		window.open(LinkedInShareMethod.SHARE_ENDPOINT_URL + '?' + urlParams.join('&'),
			'linkedin-article-sharer', `toolbar=0,status=0,width=${width},height=${height}`);

		return true;
	}

}

/**
 * Interface of parameters that can be passed to the LinkedIn createArticle endpoint. For more information
 * on each parameter, see the
 * [LinkedIn documentation](https://developer.linkedin.com/docs/share-on-linkedin "LinkedIn Documentation")
 */
export interface ILinkedInShareMethodOptions extends IShareMethodOptions {
	/**
	 * Corresponds to the 'summary' parameter in the LinkedIn API.
	 * The description that you wish you use.
	*/
	text? : string
	/**
	 * The title value that you wish you use.
	 */
	title? : string;
	/**
	 * The source of the content (e.g. your website or application name)
	 */
	source? : string;
	/**
	 * The width of the popup window that opens for the article. Defaults to 520.
	 */
	window_width? : number;
	/**
	 * The height of the popup window that opens for the article. Defaults to 570.
	 */
	window_height? : number;
}

export default LinkedInShareMethod;