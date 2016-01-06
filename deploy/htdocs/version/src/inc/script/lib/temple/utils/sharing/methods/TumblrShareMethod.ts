import {IShareMethod, IShareMethodOptions} from "../ShareUtil";

/**
 * Sharing method to create a Tumblr post using the Tumblr share endpoint.
 *
 * @author Floris Bernard
 * @class TumblrShareMethod
 * @namespace temple.utils.sharing.methods.TumblrShareMethod
 */
export class TumblrShareMethod implements IShareMethod<ITumblrShareMethodOptions> {
	/**
	 * URL for the Tumblr sharing endpoint
	 */
	public static SHARE_ENDPOINT_URL:string = 'https://www.tumblr.com/widgets/share/tool';
	/**
	 * Default width of the popup window that opens to create the post in pixels.
	 */
	public static DEFAULT_WINDOW_WIDTH:number = 540;
	/**
	 * Default height of the popup window that opens to create the post in pixels.
	 */
	public static DEFAULT_WINDOW_HEIGHT:number = 600;
	/**
	 * Name for this sharing method
	 */
	public name:string = 'Tumblr Post Sharer';
	/**
	 * Unique ID for this sharing method
	 */
	public id:string = 'tumblr';

	/**
	 * Opens an window for creating a new Tumblr post.
	 * @param options An object containing options for the new post. See the
	 * ITumblrShareMethodOptions interface for detailed information on each parameter.
	 * @returns {boolean} Returns true if a window.open call was executed.
	 */
	public share(options:ITumblrShareMethodOptions):boolean
	{
		var params:any = {};

		if(options.image || options.video) {
			// Sharing type is image
			params.posttype = options.image ? 'photo' : 'video';
			params.content = encodeURIComponent(options.image);
			params.canonicalUrl = encodeURIComponent(options.canonicalUrl || options.image || options.video);
			if(options.text) {
				params.caption = encodeURIComponent(options.text);
			}
		} else if(options.isQuote) {
			params.posttype = 'quote';
			params.content = encodeURIComponent(options.text);
			params.caption = encodeURIComponent(options.source);
			params.canonicalUrl = encodeURIComponent(options.canonicalUrl || window.location.href);
		} else if(options.isChat) {
			params.posttype = 'chat';
			params.content = encodeURIComponent(options.text);
			params.title = encodeURIComponent(options.title);
			params.canonicalUrl = encodeURIComponent(options.canonicalUrl || window.location.href);
		} else if(options.url) {
			params.posttype = 'link';
			params.title = encodeURIComponent(options.title);
			params.content = encodeURIComponent(options.url);
			params.caption = encodeURIComponent(options.text);
			params.canonicalUrl = encodeURIComponent(options.canonicalUrl || options.url);
		} else {
			params.posttype = 'text';
			params.content = encodeURIComponent(options.text);
			params.title = encodeURIComponent(options.title);
			params.canonicalUrl = encodeURIComponent(options.canonicalUrl || window.location.href);
		}

		if(options.tags) {
			params.tags = options.tags.map((tag:string) => {
				return encodeURIComponent(tag);
			}).join(',');
		}
		var width = options.window_width || TumblrShareMethod.DEFAULT_WINDOW_WIDTH;
		var height = options.window_height || TumblrShareMethod.DEFAULT_WINDOW_HEIGHT;

		var urlParams = Object.keys(params).map((paramName:string) => {
			return paramName + '=' + params[paramName];
		});

		window.open(TumblrShareMethod.SHARE_ENDPOINT_URL + '?' + urlParams.join('&'),
			'tumblr-post-sharer', `toolbar=0,status=0,width=${width},height=${height}`);

		return true;
	}

}

/**
 * Interface of parameters that can be passed to the Tumblr share method.
 * The type of sharing will depend on which parameters are passed.
 * [Tumblr documentation](https://www.tumblr.com/docs/nl/share_button "Tumblr Documentation")
 */
export interface ITumblrShareMethodOptions extends IShareMethodOptions {
	/**
	 * If a link is provided, this will be a description of the link.
	 * If an image or video is provided, this will be a description for the media.
	 * If isQuote is true, this will be the content of the quote.
	 * If isChat is true, this will be the content of the chat.
	 * Otherwise, this will be the body of the text message.
	 */
	text? : string;
	/**
	 * If a link is provided, this will be the title of the link.
	 * If isChat is true, this will be the title of the chat
	 * Otherwise, this will be the title of the text message
	 */
	title? : string;
	/**
	 * If set, sets the sharing type to 'image'.
	 * The url of the image to share.
	 */
	image? : string;
	/**
	 * An array of string tags to add to the post
	 */
	tags? : string[];
	/**
	 * If set, sets the sharing type to 'video'.
	 * The url of the video to share.
	 */
	video? : string;
	/**
	 * Set to true if a quote should be shared. The text parameter will be used
	 * as content of the quote. Defaults to false.
	 */
	isQuote? : boolean;
	/**
	 * Set to true if the content type should be 'chat'. The text parameter will be used
	 * as content of the chat. The title parameter will be used as title for the chat.
	 * Defaults to false.
	 */
	isChat? : boolean;
	/**
	 * The source of the quote (if isQuote is true)
	 */
	source? : string;
	/**
	 * For note counts to display and increment properly, you must provide
	 * the canonical URL of the page.
	 * If not set, will use the url property if available. If that is not available, will use
	 * the current document.location.href.
	 */
	canonicalUrl? : string;
	/**
	 * The width of the popup window that opens for the post. Defaults to 540.
	 */
	window_width? : number;
	/**
	 * The height of the popup window that opens for the post. Defaults to 600.
	 */
	window_height? : number;
}

export default TumblrShareMethod;