import refdef from 'def/ReferenceDefinitions';
import {IShareMethod, IShareMethodOptions} from "../ShareUtil";

/**
 * Sharing method to share a story to a Facebook Feed using the Feed Dialog API. To use this method, you will need
 * to initialize the Facebook API with a valid app id. The user will need to login to the app before being able
 * to share.
 *
 * @author Floris Bernard
 * @class FacebookFeedShareMethod
 * @namespace temple.utils.sharing.methods.FacebookFeedShareMethod
 */
export class FacebookFeedShareMethod implements IShareMethod<IFacebookFeedShareMethodOptions> {
	/**
	 * Name for this sharing method
	 */
	public name:string = 'Facebook Feed Dialog';
	/**
	 * Unique ID for this sharing method
	 */
	public id:string = 'facebook-feed';

	/**
	 * Constructor for this sharing method.
	 * @param api The Facebook API to use. Usually this is the 'FB' object on window.
	 */
	constructor(public api:Facebook) {

	}

	/**
	 * Shares using the Facebook Feed Dialog API.
	 * @param options An object containing options for the new post. See the
	 * IFacebookFeedShareMethodOptions interface for detailed information on each parameter.
	 * @returns {boolean}
	 */
	public share(options:IFacebookFeedShareMethodOptions):boolean
	{
		var params = {
			to : 'to',
			link : 'url',
			picture : 'image',
			source : 'media',
			name : 'name',
			caption : 'caption',
			description : 'text'
		};

		var apiParams = Object.keys(params).filter((key:string) => {
			return options[params[key]] != null;
		}).reduce<any>((prev:string, current:any) => {
			prev[current] = options[params[current]];
			return prev;
		}, {method : 'feed'});

		if(options.callback) {
			this.api.ui(apiParams, options.callback);
		} else {
			this.api.ui(apiParams);
		}

		return true;
	}

}

/**
 * Interface for the options object that can be passed to the Facebook Feed Dialog
 * sharer. Most options are passed directly to the Facebook API. Some options have
 * been renamed for consistency with other sharing methods.
 *
 * Please see the
 * [Facebook Documentation](https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.5)
 * for more info on each parameter.
 */
export interface IFacebookFeedShareMethodOptions extends IShareMethodOptions {
	/**
	 * The callback to pass the Facebook API.
	 * @param response The response object returned by the Facebook API, containing
	 * the post id if successfully shared.
	 */
	callback? : (response:{post_id?: string; }) => any;
	/**
	 * The ID of the profile that this story will be published to.
	 */
	to? : number;
	/**
	 * Corresponds to the 'picture' parameter in the facebook API
	 * The URL of a picture attached to this post.
	 */
	image? : string;
	/**
	 * The URL of a media file (either SWF or MP3) attached to this post.
	 */
	media? : string;
	/**
	 * The caption of the link (appears beneath the link name).
	 */
	caption? : string;
	/**
	 * Corresponds to the 'description' parameter in the facebook API
	 * The description of the link (appears beneath the link caption).
	 */
	text? : string;
}

export default FacebookFeedShareMethod;