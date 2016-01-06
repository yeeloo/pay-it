import NetworkStateEnum from './mediaelement/NetworkStateEnum';
import ReadyStateEnum from './mediaelement/ReadyStateEnum';
import CanPlayEnum from './mediaelement/CanPlayEnum';
import Browser from './Browser';

/**
 * Base VideoElement to use as the base class for all videoElement related stuff
 *
 * @namespace temple.utils
 * @class Video
 * @author Mient-jan Stelling
 */
class MediaElement {

	/**
	 * @event ontime
	 * @param {string}
	 */
	public static EVENT_ONTIME = 'ontime';

	/**
	 * @event loadstart
	 * @param {string}
	 */
	public static EVENT_LOADSTART = 'loadstart';

	/**
	 * @event emptied
	 * @param {string}
	 */
	public static EVENT_EMTIED = 'emptied';

	/**
	 * @event canplaythrough
	 * @param {string}
	 */
	public static EVENT_CANPLAYTHROUGH = 'canplaythrough';

	/**
	 * @event ended
	 * @param {string}
	 */
	public static EVENT_ENDED = 'ended';

	/**
	 * @event ratechange
	 * @param {string}
	 */
	public static EVENT_RATECHANGE = 'ratechange';

	/**
	 * @event progress
	 * @param {string}
	 */
	public static EVENT_PROGRESS = 'progress';

	/**
	 * @event stalled
	 * @param {string}
	 */
	public static EVENT_STALLED = 'stalled';

	/**
	 * @event playing
	 * @param {string}
	 */
	public static EVENT_PLAYING = 'playing';

	/**
	 * @event durationchange
	 * @param {string}
	 */
	public static EVENT_DURATIONCHANGED = 'durationchange';

	/**
	 * @event resize
	 * @param {string}
	 */
	public static EVENT_RESIZE = 'resize';

	/**
	 * @event suspend
	 * @param {string}
	 */
	public static EVENT_SUSPEND = 'suspend';

	/**
	 * @event loadedmetadata
	 * @param {string}
	 */
	public static EVENT_LOADMETADATA = 'loadedmetadata';

	/**
	 * @event waiting
	 * @param {string}
	 */
	public static EVENT_WAITING = 'waiting';

	/**
	 * @event timeupdate
	 * @param {string}
	 */
	public static EVENT_TIMEUPDATE = 'timeupdate';

	/**
	 * @event volumechange
	 * @param {string}
	 */
	public static EVENT_VOLUMECHANGE = 'volumechange';

	/**
	 * @event abort
	 * @param {string}
	 */
	public static EVENT_ABORT = 'abort';

	/**
	 * @event loadeddata
	 * @param {string}
	 */
	public static EVENT_LOADEDDATA = 'loadeddata';

	/**
	 * @event seeking
	 * @param {string}
	 */
	public static EVENT_SEEKING = 'seeking';

	/**
	 * @event play
	 * @param {string}
	 */
	public static EVENT_PLAY = 'play';

	/**
	 * @event error
	 * @param {string}
	 */
	public static EVENT_ERROR = 'error';

	/**
	 * @event canplay
	 * @param {string}
	 */
	public static EVENT_CANPLAY = 'canplay';

	/**
	 * @event seeked
	 * @param {string}
	 */
	public static EVENT_SEEKED = 'seeked';

	/**
	 * @event pause
	 * @param {string}
	 */
	public static EVENT_PAUSE = 'pause';

	/**
	 * @event encrypted
	 * @param {string} only supported in chrome 42.0
	 */
	public static EVENT_ENCRYPTED = 'encrypted';

	public element:HTMLMediaElement;

	/**
	 * @class MediaElement
	 * @constructor
	 * @param element {HTMLMediaElement}
	 */
	constructor(element:HTMLMediaElement)
	{
		this.element = element;
	}

	public setAttribute(name:string, value:string):MediaElement
	{
		this.element.setAttribute(name, value);
		return this;
	}

	/**
	 * The MediaError object for the most recent error, or null if there has not been an error.
	 *
	 * @method getError
	 * @returns {MediaError}
	 */
	public getError():MediaError
	{
		return this.element.error;
	}

	/**
	 * @property error {MediaError}
	 */
	public get error():MediaError
	{
		return this.getError();
	}

	/**
	 * Reflects the style HTML attribute
	 *
	 * @method style
	 * @returns {CSSStyleDeclaration}
	 */
	public get style():CSSStyleDeclaration
	{
		return this.element.style;
	}

	/**
	 * Reflects the src HTML attribute
	 *
	 * @method getStyle
	 * @returns {CSSStyleDeclaration}
	 */
	public getStyle():CSSStyleDeclaration
	{
		return this.element.style;
	}

	/**
	 * Reflects the src HTML attribute, containing the URL of a media resource to use.
	 *
	 * Gecko implements a similar functionality for streams: mozSrcObject.
	 *
	 * @method getSrc
	 * @returns {string}
	 */
	public getSrc():string
	{
		return this.element.src;
	}

	/**
	 * @method setSrc
	 * @param value {string}
	 */
	public setSrc(value:string):void
	{
		this.element.src = value;
	}

	/**
	 * @property src {string}
	 */
	public get src():string
	{
		return this.getSrc();
	}

	public set src(value:string)
	{
		this.setSrc( value );
	}

	/**
	 * The absolute URL of the chosen media resource (if, for example, the server selects a media file based on the
	 * resolution of the user's display), or an empty string if the networkState is EMPTY.
	 *
	 * @method getCurrentSrc
	 * @return string
	 */
	public getCurrentSrc():string
	{
		return this.element.currentSrc;
	}

	/**
	 * @property currentSrc {string}
	 */
	public get currentSrc():string
	{
		return this.getCurrentSrc();
	}

	/**
	 * The CORS setting for this image element. See CORS settings attributes for details.
	 *
	 * @todo maybe not supported in ie, safari, opera
	 * @method getCrossOrigin
	 * @return string
	 */
	public getCrossOrigin():string
	{
		return this.element['crossOrigin'];
	}

	/**
	 * @property crossOrigin {string}
	 */
	public get crossOrigin():string
	{

		return this.getCrossOrigin();
	}

	/**
	 * The current state of fetching the media over the network.
	 *
	 * @method getNetworkState
	 * @return temple.utils.video.NetworkStateEnum
	 */
	public getNetworkState():NetworkStateEnum
	{
		return <NetworkStateEnum> this.element.networkState;
	}

	/**
	 * @property networkState {temple.utils.video.NetworkStateEnum}
	 */
	public get networkState():NetworkStateEnum
	{
		return this.getNetworkState();
	}

	/**
	 * Reflects the preload HTML attribute, indicating what data should be preloaded, if any. Possible values are: none,
	 * metadata, auto. See preload attribute documentation for details.
	 *
	 * @method getPreload
	 * @return string
	 */
	public getPreload():string
	{
		return this.element.preload;
	}

	/**
	 * @property preload {string}
	 */
	public get preload():string
	{
		return this.getPreload();
	}

	/**
	 * A Boolean attribute; if specified, the audio will automatically begin being downloaded, even if not set to automatically play. This continues until the media cache is full, or the entire audio file has been downloaded, whichever comes first. This should only be used when it is expected that the user will choose to play the audio; for example, if the user has navigated to a page using a "Play this audio" link. This attribute was removed in Gecko 2.0 (Firefox 4 / Thunderbird 3.3 / SeaMonkey 2.1) in favor of the preload attribute.
	 *
	 * @deprecated
	 * @property autobuffer
	 */
	public autobuffer:boolean = null;

	/**
	 * The ranges of the media source that the browser has buffered (if any) at the moment the buffered property is accessed. The returned TimeRanges object is normalized.
	 *
	 * @method getBuffered
	 * @return TimeRanges
	 */
	public getBuffered():TimeRanges
	{
		return this.element.buffered;
	}

	/**
	 * @property buffered {TimeRanges}
	 */
	public get buffered():TimeRanges
	{
		return this.getBuffered();
	}

	/**
	 * The readiness state of the media.
	 *
	 * @method getReadyState
	 * @return temple.utils.video.ReadyStateEnum
	 */
	public getReadyState():ReadyStateEnum
	{
		return <ReadyStateEnum> this.element.readyState;
	}

	/**
	 * @property readyState {ReadyStateEnum}
	 */
	public get readyState():ReadyStateEnum
	{
		return this.getReadyState();
	}

	/**
	 * Indicates whether the media is in the process of seeking to a new position.
	 *
	 * @method getSeeking
	 * @return boolean
	 */
	public getSeeking():boolean
	{
		return this.element.seeking;
	}

	/**
	 * @property seeking {boolean}
	 */
	public get seeking():boolean
	{
		return this.getSeeking();
	}

	/**
	 * The current playback time, in seconds. Setting this value seeks the media to the new time.
	 *
	 * @method getCurrentTime
	 * @return number
	 */
	public getCurrentTime():number
	{
		return this.element.currentTime;
	}

	/**
	 * @property currentTime {number}
	 */
	public get currentTime():number
	{
		return this.getCurrentTime();
	}

	/**
	 * @method setCurrentTime
	 * @param value
	 */
	public setCurrentTime(value:number)
	{
		this.element.currentTime = value;
	}

	public set currentTime(value:number)
	{
		this.setCurrentTime(value);
	}

	/**
	 * The length of the media in seconds, or zero if no media data is available.  If the media data is available but the
	 * length is unknown, this value is NaN.  If the media is streamed and has no predefined length, the value is Inf.
	 *
	 * @method getDuration
	 * @return number
	 */
	public getDuration():number
	{
		return this.element.duration;
	}

	/**
	 * @property duration {number}
	 */
	public get duration():number
	{
		return this.getDuration();
	}

	/**
	 * Indicates whether the media element is paused.
	 *
	 * @method getPaused
	 * @return boolean
	 */
	public getPaused():boolean
	{
		return this.element.paused;
	}

	/**
	 * @property paused {boolean}
	 */
	public get paused():boolean
	{
		return this.getPaused();
	}

	/**
	 * The default playback rate for the media. 1.0 is "normal speed," values lower than 1.0 make the media play slower
	 * than normal, higher values make it play faster. The value 0.0 is invalid and throws a NOT_SUPPORTED_ERR exception.
	 *
	 * @throws NOT_SUPPORTED_ERR
	 * @method getDefaultPlaybackRate
	 * @return number
	 */
	public getDefaultPlaybackRate():number
	{
		return this.element.defaultPlaybackRate;
	}

	/**
	 * @property defaultPlaybackRate {number}
	 */
	public get defaultPlaybackRate():number
	{
		return this.getDefaultPlaybackRate();
	}

	/**
	 * If the playbackRate is negative, the media is played backwards. The audio is muted when the media plays backwards
	 * or if the fast forward or slow motion is outside a useful range (E.g. Gecko mute the sound outside the range 0.25 and 5.0).
	 *
	 * @method getPlaybackRate
	 * @return number
	 */
	public getPlaybackRate():number
	{
		return this.element.playbackRate;
	}

	/**
	 * @property playbackRate {number}
	 */
	public get playbackRate():number
	{
		return this.getPlaybackRate();
	}

	/**
	 * @method setPlaybackRate
	 * @param value {number}
	 */
	public setPlaybackRate(value:number)
	{
		this.element.playbackRate = value;
	}

	/**
	 * @property playbackRate {number}
	 */
	public set playbackRate(value:number)
	{
		this.setPlaybackRate(value);
	}

	/**
	 * The ranges of the media source that the browser has played, if any.
	 *
	 * @method getPlayed
	 * @return TimeRanges
	 */
	public getPlayed():TimeRanges
	{
		return this.element.played;
	}

	public get played():TimeRanges
	{
		return this.getPlayed();
	}

	/**
	 * The time ranges that the user is able to seek to, if any.
	 *
	 * @method getSeekable
	 * @return TimeRanges
	 */
	public getSeekable():TimeRanges
	{
		return this.element.seekable;
	}

	/**
	 * @property seekable {TimeRanges}
	 */
	public get seekable():TimeRanges
	{
		return this.getSeekable();
	}

	/**
	 * Indicates whether the media element has ended playback.
	 *
	 * @method getEnded
	 * @return boolean
	 */
	public getEnded():boolean
	{
		return this.element.ended;
	}

	/**
	 * @property error {boolean}
	 */
	public get ended():boolean
	{
		return this.getEnded();
	}

	/**
	 * Reflects the autoplay HTML attribute, indicating whether playback should automatically begin as soon as enough
	 * media is available to do so without interruption.
	 *
	 * @method getAutoplay
	 * @return boolean
	 */
	public getAutoplay():boolean
	{
		return this.element.autoplay;
	}

	/**
	 * @property autoplay {boolean}
	 */
	public get autoplay():boolean
	{
		return this.getAutoplay();
	}

	/**
	 * @method setAutoplay
	 * @return value {boolean}
	 */
	public setAutoplay(value:boolean)
	{
		this.element.autoplay = value;
	}

	public set autoplay(value:boolean)
	{
		this.setAutoplay(value);
	}

	/**
	 * Reflects the loop HTML attribute, indicating whether the media element should start over when it reaches the end.
	 *
	 * @method getLoop
	 * @return boolean
	 */
	public getLoop():boolean
	{
		return this.element.loop;
	}

	/**
	 * @property loop {boolean}
	 */
	public get loop():boolean
	{
		return this.getLoop();
	}

	/**
	 * @method setLoop
	 * @param value {boolean}
	 */
	public setLoop(value:boolean)
	{
		this.element.loop = value;
	}

	public set loop(value:boolean)
	{
		this.setLoop(value);
	}

	/**
	 * Reflects the mediagroup HTML attribute, indicating the name of the group of elements it belongs to. A group of media elements shares a common controller.
	 *
	 * @method getMediaGroup
	 * @return any
	 */
	public getMediaGroup():string
	{
		return this.element['mediaGroup'];
	}

	/**
	 * @property mediaGroup {any}
	 */
	public get mediaGroup():string
	{
		return this.getMediaGroup();
	}

	/**
	 * Represents the media controller associated to the element, or null if none is linked to it.
	 *
	 * @method getController
	 * @return any
	 */
	public getController()
	{
		throw new Error('no support yet');

		return this.element['controller'];
	}

	/**
	 * @property controller {any}
	 */
	public get controller()
	{
		return this.getController();
	}

	/**
	 * If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback.
	 *
	 * @method setControls
	 * @param value {boolean}
	 * @return void
	 */
	public setControls(value:boolean)
	{
		this.element.controls = value;
	}

	public set controls(value:boolean)
	{
		this.setControls(value);
	}

	/**
	 * The audio volume, from 0.0 (silent) to 1.0 (loudest).
	 *
	 * @method getVolume
	 * @return number
	 */
	public getVolume():number
	{
		return this.element.volume;
	}

	/**
	 * @property volume {number}
	 */
	public get volume():number
	{
		return this.getVolume();
	}

	/**
	 * The audio volume, from 0.0 (silent) to 1.0 (loudest).
	 *
	 * @method setVolume
	 * @param value {number}
	 * @return void
	 */
	public setVolume(value:number)
	{
		// no support for ios
		if( Browser.ios || Browser.android )
		{
			throw new Error ('no ios or android support');
		}

		this.element.volume = value;
	}

	public set volume(value:number)
	{
		this.setVolume(value);
	}

	/**
	 * true if the audio is muted, and false otherwise.
	 *
	 * @method getMuted
	 * @return boolean
	 */
	public getMuted():boolean
	{
		return this.element.muted;
	}

	/**
	 * @property error {MediaError}
	 */
	public get muted():boolean
	{
		return this.getMuted();
	}

	/**
	 * true if the audio is muted, and false otherwise.
	 *
	 * @method setMuted
	 * @param value {boolean}
	 * @return void
	 */
	public setMuted(value:boolean)
	{
		// no support for ios
		if( Browser.ios ){
			throw new Error ('no ios support');
		}

		this.element.muted = value;
	}

	public set muted(value:boolean)
	{
		this.setMuted(value);
	}

	/**
	 * Reflects the muted HTML attribute, indicating whether the media element's audio output should be muted by default.
	 * This property has no dynamic effect, to mute and unmute the audio output, use the muted property.
	 *
	 * @todo check support ie, opera, safari
	 * @method getDefaultMuted
	 * @return boolean
	 */
	public getDefaultMuted():boolean
	{
		if( this.element['defaultMuted'] === void 0){
			this.element['defaultMuted'] = false;
		}

		return this.element['defaultMuted'];
	}

	/**
	 * @property defaultMuted {boolean}
	 */
	public get defaultMuted():boolean
	{
		return this.getDefaultMuted();
	}

	/**
	 * Represents the list of AudioTrack objects contained in the element.
	 *
	 * @method getAudioTracks
	 * @return any
	 */
	public getAudioTracks():any
	{
		throw new Error('no support yet');

		return this.element['audioTracks'];
	}

	/**
	 * @property audioTracks {any}
	 */
	public get audioTracks()
	{
		return this.getAudioTracks();
	}

	/**
	 * Represents the list of VideoTrack objects contained in the element.
	 * Note: Yet Gecko supports only single track playback, and the parsing of tracks' metadata is only available for media with Ogg container foramt.
	 *
	 * @method getVideoTracks
	 * @return any
	 */
	public getVideoTracks():any
	{
		throw new Error('no support yet');
		return this.element['videoTracks'];
	}

	/**
	 * @property videoTracks {any}
	 */
	public get videoTracks():any
	{
		return this.getVideoTracks();
	}

	/**
	 * Represents the list of TextTrack objects contained in the element.
	 *
	 * @method getTextTracks
	 * @return TextTrackList
	 */
	public getTextTracks():TextTrackList
	{
		throw new Error('no support yet');
		return this.element['textTracks'];
	}

	/**
	 * @property textTracks {TextTrackList}
	 */
	public get textTracks():TextTrackList
	{
		return this.getTextTracks();
	}

	/**
	 * @method addEventListener
	 * @param type {string} A string representing the event type to listen for.
	 * @param listener {Function} The object that receives a notification when an event of the specified type occurs. This must be an object implementing the EventListener interface, or simply a JavaScript function.
	 * @param useCapture {boolean} If true, useCapture indicates that the user wishes to initiate capture. After initiating capture, all events of the specified type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. Events which are bubbling upward through the tree will not trigger a listener designated to use capture. See DOM Level 3 Events and JavaScript Event order for a detailed explanation. If not specified, useCapture defaults to false.
	 */
	public addEventListener(type:"abort", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"activate", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"ariarequest", listener:(ev:any) => any, useCapture?:boolean):void;
	public addEventListener(type:"beforeactivate", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"beforecopy", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"beforecut", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"beforedeactivate", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"beforepaste", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"blur", listener:(ev:FocusEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"canplay", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"canplaythrough", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"change", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"click", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"command", listener:(ev:any) => any, useCapture?:boolean):void;
	public addEventListener(type:"contextmenu", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"copy", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"cuechange", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"cut", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"dblclick", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"deactivate", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"drag", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"dragend", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"dragenter", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"dragleave", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"dragover", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"dragstart", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"drop", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"durationchange", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"emptied", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"ended", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"error", listener:(ev:ErrorEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"focus", listener:(ev:FocusEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"gotpointercapture", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"input", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"keydown", listener:(ev:KeyboardEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"keypress", listener:(ev:KeyboardEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"keyup", listener:(ev:KeyboardEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"load", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"loadeddata", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"loadedmetadata", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"loadstart", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"lostpointercapture", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mousedown", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mouseenter", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mouseleave", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mousemove", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mouseout", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mouseover", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mouseup", listener:(ev:MouseEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"mousewheel", listener:(ev:MouseWheelEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"msneedkey", listener:(ev:MSMediaKeyNeededEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"paste", listener:(ev:DragEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pause", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"play", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"playing", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointercancel", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointerdown", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointerenter", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointerleave", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointermove", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointerout", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointerover", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"pointerup", listener:(ev:PointerEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"progress", listener:(ev:ProgressEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"ratechange", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"reset", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"scroll", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"seeked", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"seeking", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"select", listener:(ev:UIEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:"selectstart", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"stalled", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"submit", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"suspend", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"timeupdate", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"touchcancel", listener:(ev:any) => any, useCapture?:boolean):void;
	public addEventListener(type:"touchend", listener:(ev:any) => any, useCapture?:boolean):void;
	public addEventListener(type:"touchmove", listener:(ev:any) => any, useCapture?:boolean):void;
	public addEventListener(type:"touchstart", listener:(ev:any) => any, useCapture?:boolean):void;
	public addEventListener(type:"volumechange", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"waiting", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"webkitfullscreenchange", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"webkitfullscreenerror", listener:(ev:Event) => any, useCapture?:boolean):void;
	public addEventListener(type:"wheel", listener:(ev:WheelEvent) => any, useCapture?:boolean):void;
	public addEventListener(type:string, listener:any, useCapture?:boolean):void;
	public addEventListener(type:string, listener: (ev: MSMediaKeyNeededEvent) => any, useCapture?: boolean): void
	{
		this.element.addEventListener(type, listener, useCapture);
	}

	public addOnTime(time:number, listener:() => any):void
	{
		var int;
		int = setInterval(() => {
			var currentTime = this.element.currentTime;
			if( currentTime > time){
				listener.call(this);
				clearInterval(int);
			}
		}, 1000 / 60);
	}

	/**
	 * @method removeEventListener
	 * @param type {string} A string representing the event type to remove.
	 * @param listener {Function} The EventListener function to remove from the event target.
	 * @param useCapture {boolean} Specifies whether the EventListener to be removed was registered as a capturing listener or not. If this parameter is absent, a default value of false is assumed. If a listener was registered twice, one with capture and one without, each must be removed separately. Removal of a capturing listener does not affect a non-capturing version of the same listener, and vice versa. Note: useCapture was required in most major browsers' early versions. If broad compatibility is desired, you should always provide the useCapture parameter.
	 */
	public removeEventListener(type: string, listener: (ev: MSMediaKeyNeededEvent) => any, useCapture?: boolean): void
	{
		this.element.removeEventListener(type, listener, useCapture);
	}

	/**
	 * Determines whether the specified media type can be played back.
	 * Note: Previously canPlayType('video/webm') returned 'probably'. Starting with Gecko 28 (Firefox 28 / Thunderbird 28 / SeaMonkey 2.25 / Firefox OS 1.3), it returns 'maybe'.
	 *
	 * @method canPlayType
	 * @param canPlayType {number}
	 * @return {number}
	 */
	public canPlayType(value:string):CanPlayEnum
	{
		var can = this.element.canPlayType(value);

		switch( can ){
			case 'probably':{
				return CanPlayEnum.PROBABLY;
				break;
			}

			case 'maybe':{
				return CanPlayEnum.MAYBE;
				break;
			}


			default:{
				return CanPlayEnum.NO;
				break;
			}
		}

	}

	/**
	 * Method is experimental and should be used,
	 * Directly seek to the given time.
	 *
	 * @method fastSeek
	 * @return number
	 */
	public fastSeek(value:string):void
	{
		this.element['fastSeek'](value);
	}

	/**
	 * Begins playback of the media.
	 *
	 * @method play
	 * @return void
	 */
	public play():void
	{
		this.element.play();
	}


	/**
	 * Pauses the media playback.
	 *
	 * @method pause
	 * @return void
	 */
	public pause():void
	{
		this.element.pause();
	}

	/**
	 * Reset the media element and restart selecting the media resource.  Any pending events are discarded.  How much media
	 * data is fetched is still affected by the preload attribute.  This method can be useful for releasing resources after
	 * any src attribute and source element descendants have been removed.  Otherwise, it is usually unnecessary to use
	 * this method, unless required to rescan source element children after dynamic changes.
	 *
	 * @method load
	 * @return void
	 */
	public load():void
	{
		this.element.load();
	}

	/**
	 * @method setMediaKeys
	 */
	public setMediaKeys()
	{
		throw new Error('experimental')
	}
}

export default MediaElement;