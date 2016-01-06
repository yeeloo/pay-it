define(["require", "exports"], function (require, exports) {
    var FacebookPermissions = (function () {
        function FacebookPermissions() {
        }
        // ----------------------------------------------- USER DATA PERMISSIONS
        /**
         * Provides access to the "About Me" section of the profile in the about property.
         */
        FacebookPermissions.USER_ABOUT_ME = 'user_about_me';
        /**
         * Provides access to the user's list of activities as the activities connection.
         */
        FacebookPermissions.USER_ACTIVITIES = 'user_activities';
        /**
         * Provides access to the birthday with year as the birthday_date property
         */
        FacebookPermissions.USER_BIRTHDAY = 'user_birthday';
        /**
         * Provides read access to the authorized user's check-ins or a friend's check-ins that the user can see.
         */
        FacebookPermissions.USER_CHECKINS = 'user_checkins';
        /**
         * Provides access to education history as the education property
         */
        FacebookPermissions.USER_EDUCATION_HISTORY = 'user_education_history';
        /**
         * Provides access to the list of events the user is attending as the events connection
         */
        FacebookPermissions.USER_EVENTS = 'user_events';
        /**
         *
         */
        FacebookPermissions.USER_GAMES_ACTIVITY = 'user_games_activity';
        /**
         * Provides access to the list of groups the user is a member of as the groups connection
         */
        FacebookPermissions.USER_GROUPS = 'user_groups';
        /**
         * Provides access to the user's hometown in the hometown property
         */
        FacebookPermissions.USER_HOMETOWN = 'user_hometown';
        /**
         * Provides access to the user's list of interests as the interests connection
         */
        FacebookPermissions.USER_INTERESTS = 'user_interests';
        /**
         * Provides access to the list of all of the pages the user has liked as the likes connection
         */
        FacebookPermissions.USER_LIKES = 'user_likes';
        /**
         * Provides access to the user's current location as the location property
         */
        FacebookPermissions.USER_LOCATION = 'user_location';
        /**
         * Provides access to the user's notes as the notes connection
         */
        FacebookPermissions.USER_NOTES = 'user_notes';
        /**
         * Provides access to the user's online/offline presence
         */
        FacebookPermissions.USER_ONLINE_PRESENCE = 'user_online_presence';
        /**
         * Provides access to the photos the user has uploaded
         */
        FacebookPermissions.USER_PHOTOS = 'user_photos';
        /**
         * Provides access to the user's family and personal relationships and relationship status
         */
        FacebookPermissions.USER_RELATIONSHIPS = 'user_relationships';
        /**
         * Provides access to the user's relationship preferences
         */
        FacebookPermissions.USER_RELATIONSHIP_DETAILS = 'user_relationship_details';
        /**
         * Provides access to the user's religious and political affiliations
         */
        FacebookPermissions.USER_RELIGION_POLITICS = 'user_religion_politics';
        /**
         * Provides access to the user's most recent status message
         */
        FacebookPermissions.USER_STATUS = 'user_status';
        /**
         * Provides access to the videos the user has uploaded
         */
        FacebookPermissions.USER_VIDEOS = 'user_videos';
        /**
         * Provides access to the user's web site URL
         */
        FacebookPermissions.USER_WEBSITE = 'user_website';
        /**
         * Provides access to work history as the work property
         */
        FacebookPermissions.USER_WORK_HISTORY = 'user_work_history';
        /**
         * Provides access to Open Graph Music actions
         */
        FacebookPermissions.USER_ACTIONS_MUSIC = 'user_actions.music';
        /**
         * Provides access to Open Graph News actions
         */
        FacebookPermissions.USER_ACTIONS_NEWS = 'user_actions.news';
        /**
         * Provides access to Open Graph Video actions
         */
        FacebookPermissions.USER_ACTIONS_VIDEO = 'user_actions.video';
        /**
         * Provides access to the user's primary email address in the email property. Do not spam users. Your use of email must comply both with Facebook policies and with the CAN-SPAM Act.
         */
        FacebookPermissions.EMAIL = 'email';
        /**
         * Provides access to any friend lists the user created. All user's friends are provided as part of basic data, this extended permission grants access to the lists of friends a user has created, and should only be requested if your application utilizes lists of friends.
         */
        FacebookPermissions.READ_FRIENDLISTS = 'read_friendlists';
        /**
         * Provides read access to the Insights data for pages, applications, and domains the user owns.
         */
        FacebookPermissions.READ_INSIGHTS = 'read_insights';
        /**
         * Provides the ability to read from a user's Facebook Inbox.
         */
        FacebookPermissions.READ_MAILBOX = 'read_mailbox';
        /**
         * Provides read access to the user's friend requests
         */
        FacebookPermissions.READ_REQUESTS = 'read_requests';
        /**
         * Provides access to all the posts in the user's News Feed and enables your application to perform searches against the user's News Feed
         */
        FacebookPermissions.READ_STREAM = 'read_stream';
        /**
         * Provides applications that integrate with Facebook Chat the ability to log in users.
         */
        FacebookPermissions.XMPP_LOGIN = 'xmpp_login';
        /**
         * Provides the ability to manage ads and call the Facebook Ads API on behalf of a user.
         */
        FacebookPermissions.ADS_MANAGEMENT = 'ads_management';
        /**
         * TODO
         */
        FacebookPermissions.PHOTO_UPLOAD = 'photo_upload';
        /**
         * TODO
         */
        FacebookPermissions.CREATE_NOTE = 'create_note';
        /**
         * TODO
         */
        FacebookPermissions.SHARE_ITEM = 'share_item';
        /**
         * TODO
         */
        FacebookPermissions.STATUS_UPDATE = 'status_update';
        /**
         * TODO
         */
        FacebookPermissions.VIDEO_UPLOAD = 'video_upload';
        // ----------------------------------------------- FRIENDS DATA PERMISSIONS
        /**
         * Provides access to the "About Me" section of the profile in the about property
         */
        FacebookPermissions.FRIENDS_ABOUT_ME = 'friends_about_me';
        /**
         * Provides access to the user's list of activities as the activities connection
         */
        FacebookPermissions.FRIENDS_ACTIVITIES = 'friends_activities';
        /**
         * Provides access to the birthday with year as the birthday_date property
         */
        FacebookPermissions.FRIENDS_BIRTHDAY = 'friends_birthday';
        /**
         * Provides access to education history as the education property
         */
        FacebookPermissions.FRIENDS_EDUCATION_HISTORY = 'friends_education_history';
        /**
         * Provides access to the list of events the user is attending as the events connection
         */
        FacebookPermissions.FRIENDS_EVENTS = 'friends_events';
        /**
         *
         */
        FacebookPermissions.FRIENDS_GAMES_ACTIVITY = 'friends_games_activity';
        /**
         * Provides access to the list of groups the user is a member of as the groups connection
         */
        FacebookPermissions.FRIENDS_GROUPS = 'friends_groups';
        /**
         * Provides access to the user's hometown in the hometown property
         */
        FacebookPermissions.FRIENDS_HOMETOWN = 'friends_hometown';
        /**
         * Provides access to the user's list of interests as the interests connection
         */
        FacebookPermissions.FRIENDS_INTERESTS = 'friends_interests';
        /**
         * Provides access to the list of all of the pages the user has liked as the likes connection
         */
        FacebookPermissions.FRIENDS_LIKES = 'friends_likes';
        /**
         * Provides access to the user's current location as the location property
         */
        FacebookPermissions.FRIENDS_LOCATION = 'friends_location';
        /**
         * Provides access to the user's notes as the notes connection
         */
        FacebookPermissions.FRIENDS_NOTES = 'friends_notes';
        /**
         * Provides access to the user's online/offline presence
         */
        FacebookPermissions.FRIENDS_ONLINE_PRESENCE = 'friends_online_presence';
        /**
         * Provides access to the photos the user has uploaded
         */
        FacebookPermissions.FRIENDS_PHOTOS = 'friends_photos';
        /**
         * Provides access to the user's family and personal relationships and relationship status
         */
        FacebookPermissions.FRIENDS_RELATIONSHIPS = 'friends_relationships';
        /**
         * Provides access to the user's relationship preferences
         */
        FacebookPermissions.FRIENDS_RELATIONSHIP_DETAILS = 'friends_relationship_details';
        /**
         * Provides access to the user's religious and political affiliations
         */
        FacebookPermissions.FRIENDS_RELIGION_POLITICS = 'friends_religion_politics';
        /**
         * Provides access to the user's most recent status message
         */
        FacebookPermissions.FRIENDS_STATUS = 'friends_status';
        /**
         * Provides access to the videos the user has uploaded
         */
        FacebookPermissions.FRIENDS_VIDEOS = 'friends_videos';
        /**
         * Provides access to the user's web site URL
         */
        FacebookPermissions.FRIENDS_WEBSITE = 'friends_website';
        /**
         * Provides access to work history as the work property
         */
        FacebookPermissions.FRIENDS_WORK_HISTORY = 'friends_work_history';
        /**
         * Provides access to any friend lists the user created. All user's friends are provided as part of basic data, this extended permission grants access to the lists of friends a user has created, and should only be requested if your application utilizes lists of friends.
         */
        FacebookPermissions.MANAGE_FRIENDLISTS = 'manage_friendlists';
        /**
         * Provides read access to the authorized user's check-ins or a friend's check-ins that the user can see.
         */
        FacebookPermissions.FRIENDS_CHECKINS = 'friends_checkins';
        /**
         * Provides access to Open Graph Music actions
         */
        FacebookPermissions.FRIENDS_ACTIONS_MUSIC = 'friends_actions.music';
        /**
         * Provides access to Open Graph News actions
         */
        FacebookPermissions.FRIENDS_ACTIONS_NEWS = 'friends_actions.news';
        /**
         * Provides access to Open Graph Video actions
         */
        FacebookPermissions.FRIENDS_ACTIONS_VIDEO = 'friends_actions.video';
        // ----------------------------------------------- PUBLISHING PERMISSIONS
        /**
         * Enables your application to post content, comments, and likes to a user's stream and to the streams of the user's friends. With this permission, you can publish content to a user's feed at any time, without requiring offline_access. However, please note that Facebook recommends a user-initiated sharing model.
         */
        FacebookPermissions.PUBLISH_STREAM = 'publish_stream';
        /**
         * Enables your application to post scores.
         */
        FacebookPermissions.PUBLISH_ACTIONS = 'publish_actions';
        /**
         * Enables your application to create and modify events on the user's behalf
         */
        FacebookPermissions.CREATE_EVENT = 'create_event';
        /**
         * Enables your application to RSVP to events on the user's behalf
         */
        FacebookPermissions.RSVP_EVENT = 'rsvp_event';
        /**
         * Enables your application to send messages to the user and respond to messages from the user via text message
         */
        FacebookPermissions.SMS = 'sms';
        /**
         * Enables your application to perform authorized requests on behalf of the user at any time. By default, most access tokens expire after a short time period to ensure applications only make requests on behalf of the user when the are actively using the application. This permission makes the access token returned by our OAuth endpoint long-lived.
         */
        FacebookPermissions.OFFLINE_ACCESS = 'offline_access';
        /**
         * Enables your application to perform checkins on behalf of the user
         */
        FacebookPermissions.PUBLISH_CHECKINS = 'publish_checkins';
        // ----------------------------------------------- PAGE PERMISSIONS
        /**
         * Enables your application to retrieve access_tokens for pages the user administrates. The access tokens can be queried using the "accounts" connection in the Graph API. This permission is only compatible with the Graph API.
         */
        FacebookPermissions.MANAGE_PAGES = 'manage_pages';
        /**
         * Enables your app to read notifications and mark them as read.
         */
        FacebookPermissions.MANAGE_NOTIFICATIONS = 'manage_notifications';
        return FacebookPermissions;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FacebookPermissions;
});
