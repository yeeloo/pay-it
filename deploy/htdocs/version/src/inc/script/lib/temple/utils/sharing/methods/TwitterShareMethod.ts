import {IShareMethod, IShareMethodOptions} from "../ShareUtil";

/**
 * Sharing method that uses a Twitter Tweet Web Intent to create a new tweet. See the
 * [Twitter documentation](https://dev.twitter.com/web/tweet-button/web-intent "Twitter Documentation")
 * for more info.
 *
 * @author Floris Bernard
 * @class TwitterShareMethod
 * @namespace temple.utils.sharing.methods.TwitterShareMethod
 */
export class TwitterShareMethod implements IShareMethod<ITwitterShareMethodOptions> {
	/**
	 * URL for the Twitter Tweet Web Intent
	 */
	public static WEB_INTENT_URL:string = 'https://twitter.com/intent/tweet';
	/**
	 * Default height of the popup window that opens to create the tweet in pixels.
	 */
	public static DEFAULT_WINDOW_HEIGHT:number = 450;
	/**
	 * Default width of the popup window that opens to create the tweet in pixels.
	 */
	public static DEFAULT_WINDOW_WIDTH:number = 690;
	/**
	 * Name for this sharing method
	 */
	public name:string = 'Twitter Tweet Intent';
	/**
	 * Unique ID for this sharing method
	 */
	public id:string = 'twitter';

	/**
	 * Opens an window executing a Twitter Tweet Web Intent
	 * @param options An object containing options for the tweet intent. See the
	 * ITwitterShareMethodOptions interface for detailed information on each parameter.
	 * @returns {boolean} Returns true if a window.open call was executed.
	 */
	public share(options:ITwitterShareMethodOptions):boolean
	{
		var stringParams:string[] = ['text', 'url', 'inReplyTo', 'via', 'lang'];
		var listParams:string[] = ['hashtags', 'related'];
		var urlParams:string[] = [];
		stringParams.forEach((param) =>
		{
			if(typeof options[param] == 'string')
			{
				var paramName = param == 'inReplyTo' ? 'in-reply-to' : param;
				urlParams.push(paramName + '=' + encodeURIComponent(options[param]));
			}
		});
		listParams.forEach((param) =>
		{
			if(typeof options[param] != 'undefined')
			{
				urlParams.push(param + '=' + options[param].map((value) =>
					{
						return encodeURIComponent(value);
					}).join(','));
			}
		});

		var width = options.window_width || TwitterShareMethod.DEFAULT_WINDOW_WIDTH;
		var height = options.window_height || TwitterShareMethod.DEFAULT_WINDOW_HEIGHT;

		window.open(TwitterShareMethod.WEB_INTENT_URL + '?' + urlParams.join('&'),
			'twitter-tweet-intent', `toolbar=0,status=0,width=${width},height=${height}`);

		return true;
	}

}

/**
 * Interface of parameters that can be passed to the Twitter Tweet Web Intent. For more information
 * on each parameter, see the
 * [Twitter documentation](https://dev.twitter.com/web/tweet-button/web-intent "Twitter Documentation")
 */
export interface ITwitterShareMethodOptions extends IShareMethodOptions {
	/**
	 * Text to tweet. Corresponds to the 'text' parameter of the Tweet Web Intent
	 */
	text? : string
	/**
	 * Array of hashtags to include in the tweet. Corresponds to the 'hashtags' parameter of the
	 * Tweet Web Intent
	 */
	hashtags? : string[];
	/**
	 * A Twitter username to associate with the Tweet. Corresponds to the 'via' parameter of the
	 * Tweet Web Intent
	 */
	via? : string;
	/**
	 * Suggest additional Twitter usernames related to the Tweet as an array of strings.
	 * Corresponds to the 'related' parameter of the Tweet Web Intent
	 */
	related? : string[];
	/**
	 * The Tweet ID of a parent Tweet in a conversation. Corresponds to the 'in-reply-to' parameter
	 * of the Tweet Web Intent
	 */
	inReplyTo? : string;
	/**
	 * Overwrite the default language display of the Tweet Intent. See Twitter documentation for
	 * a list of
	 * [Twitter for Website Languages](https://dev.twitter.com/web/overview/languages)
	 */
	lang? : string;
	/**
	 * The width of the popup window that opens for the tweet. Defaults to 690.
	 */
	window_width? : number;
	/**
	 * The height of the popup window that opens for the tweet. Defaults to 450.
	 */
	window_height? : number;
}

export default TwitterShareMethod;