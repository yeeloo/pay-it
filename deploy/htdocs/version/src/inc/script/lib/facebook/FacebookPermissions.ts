class FacebookPermissions
{
	// ----------------------------------------------- USER DATA PERMISSIONS

	/**
	 * Provides access to the "About Me" section of the profile in the about property.
	 */
	public static USER_ABOUT_ME:string = 'user_about_me';

	/**
	 * Provides access to the user's list of activities as the activities connection.
	 */
	public static USER_ACTIVITIES:string = 'user_activities';

	/**
	 * Provides access to the birthday with year as the birthday_date property
	 */
	public static USER_BIRTHDAY:string = 'user_birthday';

	/**
	 * Provides read access to the authorized user's check-ins or a friend's check-ins that the user can see.
	 */
	public static USER_CHECKINS:string = 'user_checkins';

	/**
	 * Provides access to education history as the education property
	 */
	public static USER_EDUCATION_HISTORY:string = 'user_education_history';

	/**
	 * Provides access to the list of events the user is attending as the events connection
	 */
	public static USER_EVENTS:string = 'user_events';

	/**
	 *
	 */
	public static USER_GAMES_ACTIVITY:string = 'user_games_activity';

	/**
	 * Provides access to the list of groups the user is a member of as the groups connection
	 */
	public static USER_GROUPS:string = 'user_groups';

	/**
	 * Provides access to the user's hometown in the hometown property
	 */
	public static USER_HOMETOWN:string = 'user_hometown';

	/**
	 * Provides access to the user's list of interests as the interests connection
	 */
	public static USER_INTERESTS:string = 'user_interests';

	/**
	 * Provides access to the list of all of the pages the user has liked as the likes connection
	 */
	public static USER_LIKES:string = 'user_likes';

	/**
	 * Provides access to the user's current location as the location property
	 */
	public static USER_LOCATION:string = 'user_location';

	/**
	 * Provides access to the user's notes as the notes connection
	 */
	public static USER_NOTES:string = 'user_notes';

	/**
	 * Provides access to the user's online/offline presence
	 */
	public static USER_ONLINE_PRESENCE:string = 'user_online_presence';

	/**
	 * Provides access to the photos the user has uploaded
	 */
	public static USER_PHOTOS:string = 'user_photos';

	/**
	 * Provides access to the user's family and personal relationships and relationship status
	 */
	public static USER_RELATIONSHIPS:string = 'user_relationships';

	/**
	 * Provides access to the user's relationship preferences
	 */
	public static USER_RELATIONSHIP_DETAILS:string = 'user_relationship_details';

	/**
	 * Provides access to the user's religious and political affiliations
	 */
	public static USER_RELIGION_POLITICS:string = 'user_religion_politics';

	/**
	 * Provides access to the user's most recent status message
	 */
	public static USER_STATUS:string = 'user_status';

	/**
	 * Provides access to the videos the user has uploaded
	 */
	public static USER_VIDEOS:string = 'user_videos';

	/**
	 * Provides access to the user's web site URL
	 */
	public static USER_WEBSITE:string = 'user_website';

	/**
	 * Provides access to work history as the work property
	 */
	public static USER_WORK_HISTORY:string = 'user_work_history';

	/**
	 * Provides access to Open Graph Music actions
	 */
	public static USER_ACTIONS_MUSIC:string = 'user_actions.music';

	/**
	 * Provides access to Open Graph News actions
	 */
	public static USER_ACTIONS_NEWS:string = 'user_actions.news';

	/**
	 * Provides access to Open Graph Video actions
	 */
	public static USER_ACTIONS_VIDEO:string = 'user_actions.video';

	/**
	 * Provides access to the user's primary email address in the email property. Do not spam users. Your use of email must comply both with Facebook policies and with the CAN-SPAM Act.
	 */
	public static EMAIL:string = 'email';

	/**
	 * Provides access to any friend lists the user created. All user's friends are provided as part of basic data, this extended permission grants access to the lists of friends a user has created, and should only be requested if your application utilizes lists of friends.
	 */
	public static READ_FRIENDLISTS:string = 'read_friendlists';

	/**
	 * Provides read access to the Insights data for pages, applications, and domains the user owns.
	 */
	public static READ_INSIGHTS:string = 'read_insights';

	/**
	 * Provides the ability to read from a user's Facebook Inbox.
	 */
	public static READ_MAILBOX:string = 'read_mailbox';

	/**
	 * Provides read access to the user's friend requests
	 */
	public static READ_REQUESTS:string = 'read_requests';

	/**
	 * Provides access to all the posts in the user's News Feed and enables your application to perform searches against the user's News Feed
	 */
	public static READ_STREAM:string = 'read_stream';

	/**
	 * Provides applications that integrate with Facebook Chat the ability to log in users.
	 */
	public static XMPP_LOGIN:string = 'xmpp_login';

	/**
	 * Provides the ability to manage ads and call the Facebook Ads API on behalf of a user.
	 */
	public static ADS_MANAGEMENT:string = 'ads_management';

	/**
	 * TODO
	 */
	public static PHOTO_UPLOAD:string = 'photo_upload';

	/**
	 * TODO
	 */
	public static CREATE_NOTE:string = 'create_note';

	/**
	 * TODO
	 */
	public static SHARE_ITEM:string = 'share_item';

	/**
	 * TODO
	 */
	public static STATUS_UPDATE:string = 'status_update';

	/**
	 * TODO
	 */
	public static VIDEO_UPLOAD:string = 'video_upload';


	// ----------------------------------------------- FRIENDS DATA PERMISSIONS

	/**
	 * Provides access to the "About Me" section of the profile in the about property
	 */
	public static FRIENDS_ABOUT_ME:string = 'friends_about_me';

	/**
	 * Provides access to the user's list of activities as the activities connection
	 */
	public static FRIENDS_ACTIVITIES:string = 'friends_activities';

	/**
	 * Provides access to the birthday with year as the birthday_date property
	 */
	public static FRIENDS_BIRTHDAY:string = 'friends_birthday';

	/**
	 * Provides access to education history as the education property
	 */
	public static FRIENDS_EDUCATION_HISTORY:string = 'friends_education_history';

	/**
	 * Provides access to the list of events the user is attending as the events connection
	 */
	public static FRIENDS_EVENTS:string = 'friends_events';

	/**
	 *
	 */
	public static FRIENDS_GAMES_ACTIVITY:string = 'friends_games_activity';

	/**
	 * Provides access to the list of groups the user is a member of as the groups connection
	 */
	public static FRIENDS_GROUPS:string = 'friends_groups';

	/**
	 * Provides access to the user's hometown in the hometown property
	 */
	public static FRIENDS_HOMETOWN:string = 'friends_hometown';

	/**
	 * Provides access to the user's list of interests as the interests connection
	 */
	public static FRIENDS_INTERESTS:string = 'friends_interests';

	/**
	 * Provides access to the list of all of the pages the user has liked as the likes connection
	 */
	public static FRIENDS_LIKES:string = 'friends_likes';

	/**
	 * Provides access to the user's current location as the location property
	 */
	public static FRIENDS_LOCATION:string = 'friends_location';

	/**
	 * Provides access to the user's notes as the notes connection
	 */
	public static FRIENDS_NOTES:string = 'friends_notes';

	/**
	 * Provides access to the user's online/offline presence
	 */
	public static FRIENDS_ONLINE_PRESENCE:string = 'friends_online_presence';

	/**
	 * Provides access to the photos the user has uploaded
	 */
	public static FRIENDS_PHOTOS:string = 'friends_photos';

	/**
	 * Provides access to the user's family and personal relationships and relationship status
	 */
	public static FRIENDS_RELATIONSHIPS:string = 'friends_relationships';

	/**
	 * Provides access to the user's relationship preferences
	 */
	public static FRIENDS_RELATIONSHIP_DETAILS:string = 'friends_relationship_details';

	/**
	 * Provides access to the user's religious and political affiliations
	 */
	public static FRIENDS_RELIGION_POLITICS:string = 'friends_religion_politics';

	/**
	 * Provides access to the user's most recent status message
	 */
	public static FRIENDS_STATUS:string = 'friends_status';

	/**
	 * Provides access to the videos the user has uploaded
	 */
	public static FRIENDS_VIDEOS:string = 'friends_videos';

	/**
	 * Provides access to the user's web site URL
	 */
	public static FRIENDS_WEBSITE:string = 'friends_website';

	/**
	 * Provides access to work history as the work property
	 */
	public static FRIENDS_WORK_HISTORY:string = 'friends_work_history';

	/**
	 * Provides access to any friend lists the user created. All user's friends are provided as part of basic data, this extended permission grants access to the lists of friends a user has created, and should only be requested if your application utilizes lists of friends.
	 */
	public static MANAGE_FRIENDLISTS:string = 'manage_friendlists';

	/**
	 * Provides read access to the authorized user's check-ins or a friend's check-ins that the user can see.
	 */
	public static FRIENDS_CHECKINS:string = 'friends_checkins';

	/**
	 * Provides access to Open Graph Music actions
	 */
	public static FRIENDS_ACTIONS_MUSIC:string = 'friends_actions.music';

	/**
	 * Provides access to Open Graph News actions
	 */
	public static FRIENDS_ACTIONS_NEWS:string = 'friends_actions.news';

	/**
	 * Provides access to Open Graph Video actions
	 */
	public static FRIENDS_ACTIONS_VIDEO:string = 'friends_actions.video';

	// ----------------------------------------------- PUBLISHING PERMISSIONS

	/**
	 * Enables your application to post content, comments, and likes to a user's stream and to the streams of the user's friends. With this permission, you can publish content to a user's feed at any time, without requiring offline_access. However, please note that Facebook recommends a user-initiated sharing model.
	 */
	public static PUBLISH_STREAM:string = 'publish_stream';

	/**
	 * Enables your application to post scores.
	 */
	public static PUBLISH_ACTIONS:string = 'publish_actions';

	/**
	 * Enables your application to create and modify events on the user's behalf
	 */
	public static CREATE_EVENT:string = 'create_event';

	/**
	 * Enables your application to RSVP to events on the user's behalf
	 */
	public static RSVP_EVENT:string = 'rsvp_event';

	/**
	 * Enables your application to send messages to the user and respond to messages from the user via text message
	 */
	public static SMS:string = 'sms';

	/**
	 * Enables your application to perform authorized requests on behalf of the user at any time. By default, most access tokens expire after a short time period to ensure applications only make requests on behalf of the user when the are actively using the application. This permission makes the access token returned by our OAuth endpoint long-lived.
	 */
	public static OFFLINE_ACCESS:string = 'offline_access';

	/**
	 * Enables your application to perform checkins on behalf of the user
	 */
	public static PUBLISH_CHECKINS:string = 'publish_checkins';

	// ----------------------------------------------- PAGE PERMISSIONS

	/**
	 * Enables your application to retrieve access_tokens for pages the user administrates. The access tokens can be queried using the "accounts" connection in the Graph API. This permission is only compatible with the Graph API.
	 */
	public static MANAGE_PAGES:string = 'manage_pages';

	/**
	 * Enables your app to read notifications and mark them as read.
	 */
	public static MANAGE_NOTIFICATIONS:string = 'manage_notifications';
}

export default FacebookPermissions;