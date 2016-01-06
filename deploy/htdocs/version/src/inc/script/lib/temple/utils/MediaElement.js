define(["require", "exports", './Browser'], function (require, exports, Browser_1) {
    /**
     * Base VideoElement to use as the base class for all videoElement related stuff
     *
     * @namespace temple.utils
     * @class Video
     * @author Mient-jan Stelling
     */
    var MediaElement = (function () {
        /**
         * @class MediaElement
         * @constructor
         * @param element {HTMLMediaElement}
         */
        function MediaElement(element) {
            /**
             * A Boolean attribute; if specified, the audio will automatically begin being downloaded, even if not set to automatically play. This continues until the media cache is full, or the entire audio file has been downloaded, whichever comes first. This should only be used when it is expected that the user will choose to play the audio; for example, if the user has navigated to a page using a "Play this audio" link. This attribute was removed in Gecko 2.0 (Firefox 4 / Thunderbird 3.3 / SeaMonkey 2.1) in favor of the preload attribute.
             *
             * @deprecated
             * @property autobuffer
             */
            this.autobuffer = null;
            this.element = element;
        }
        MediaElement.prototype.setAttribute = function (name, value) {
            this.element.setAttribute(name, value);
            return this;
        };
        /**
         * The MediaError object for the most recent error, or null if there has not been an error.
         *
         * @method getError
         * @returns {MediaError}
         */
        MediaElement.prototype.getError = function () {
            return this.element.error;
        };
        Object.defineProperty(MediaElement.prototype, "error", {
            /**
             * @property error {MediaError}
             */
            get: function () {
                return this.getError();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MediaElement.prototype, "style", {
            /**
             * Reflects the style HTML attribute
             *
             * @method style
             * @returns {CSSStyleDeclaration}
             */
            get: function () {
                return this.element.style;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Reflects the src HTML attribute
         *
         * @method getStyle
         * @returns {CSSStyleDeclaration}
         */
        MediaElement.prototype.getStyle = function () {
            return this.element.style;
        };
        /**
         * Reflects the src HTML attribute, containing the URL of a media resource to use.
         *
         * Gecko implements a similar functionality for streams: mozSrcObject.
         *
         * @method getSrc
         * @returns {string}
         */
        MediaElement.prototype.getSrc = function () {
            return this.element.src;
        };
        /**
         * @method setSrc
         * @param value {string}
         */
        MediaElement.prototype.setSrc = function (value) {
            this.element.src = value;
        };
        Object.defineProperty(MediaElement.prototype, "src", {
            /**
             * @property src {string}
             */
            get: function () {
                return this.getSrc();
            },
            set: function (value) {
                this.setSrc(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The absolute URL of the chosen media resource (if, for example, the server selects a media file based on the
         * resolution of the user's display), or an empty string if the networkState is EMPTY.
         *
         * @method getCurrentSrc
         * @return string
         */
        MediaElement.prototype.getCurrentSrc = function () {
            return this.element.currentSrc;
        };
        Object.defineProperty(MediaElement.prototype, "currentSrc", {
            /**
             * @property currentSrc {string}
             */
            get: function () {
                return this.getCurrentSrc();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The CORS setting for this image element. See CORS settings attributes for details.
         *
         * @todo maybe not supported in ie, safari, opera
         * @method getCrossOrigin
         * @return string
         */
        MediaElement.prototype.getCrossOrigin = function () {
            return this.element['crossOrigin'];
        };
        Object.defineProperty(MediaElement.prototype, "crossOrigin", {
            /**
             * @property crossOrigin {string}
             */
            get: function () {
                return this.getCrossOrigin();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The current state of fetching the media over the network.
         *
         * @method getNetworkState
         * @return temple.utils.video.NetworkStateEnum
         */
        MediaElement.prototype.getNetworkState = function () {
            return this.element.networkState;
        };
        Object.defineProperty(MediaElement.prototype, "networkState", {
            /**
             * @property networkState {temple.utils.video.NetworkStateEnum}
             */
            get: function () {
                return this.getNetworkState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Reflects the preload HTML attribute, indicating what data should be preloaded, if any. Possible values are: none,
         * metadata, auto. See preload attribute documentation for details.
         *
         * @method getPreload
         * @return string
         */
        MediaElement.prototype.getPreload = function () {
            return this.element.preload;
        };
        Object.defineProperty(MediaElement.prototype, "preload", {
            /**
             * @property preload {string}
             */
            get: function () {
                return this.getPreload();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The ranges of the media source that the browser has buffered (if any) at the moment the buffered property is accessed. The returned TimeRanges object is normalized.
         *
         * @method getBuffered
         * @return TimeRanges
         */
        MediaElement.prototype.getBuffered = function () {
            return this.element.buffered;
        };
        Object.defineProperty(MediaElement.prototype, "buffered", {
            /**
             * @property buffered {TimeRanges}
             */
            get: function () {
                return this.getBuffered();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The readiness state of the media.
         *
         * @method getReadyState
         * @return temple.utils.video.ReadyStateEnum
         */
        MediaElement.prototype.getReadyState = function () {
            return this.element.readyState;
        };
        Object.defineProperty(MediaElement.prototype, "readyState", {
            /**
             * @property readyState {ReadyStateEnum}
             */
            get: function () {
                return this.getReadyState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Indicates whether the media is in the process of seeking to a new position.
         *
         * @method getSeeking
         * @return boolean
         */
        MediaElement.prototype.getSeeking = function () {
            return this.element.seeking;
        };
        Object.defineProperty(MediaElement.prototype, "seeking", {
            /**
             * @property seeking {boolean}
             */
            get: function () {
                return this.getSeeking();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The current playback time, in seconds. Setting this value seeks the media to the new time.
         *
         * @method getCurrentTime
         * @return number
         */
        MediaElement.prototype.getCurrentTime = function () {
            return this.element.currentTime;
        };
        Object.defineProperty(MediaElement.prototype, "currentTime", {
            /**
             * @property currentTime {number}
             */
            get: function () {
                return this.getCurrentTime();
            },
            set: function (value) {
                this.setCurrentTime(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setCurrentTime
         * @param value
         */
        MediaElement.prototype.setCurrentTime = function (value) {
            this.element.currentTime = value;
        };
        /**
         * The length of the media in seconds, or zero if no media data is available.  If the media data is available but the
         * length is unknown, this value is NaN.  If the media is streamed and has no predefined length, the value is Inf.
         *
         * @method getDuration
         * @return number
         */
        MediaElement.prototype.getDuration = function () {
            return this.element.duration;
        };
        Object.defineProperty(MediaElement.prototype, "duration", {
            /**
             * @property duration {number}
             */
            get: function () {
                return this.getDuration();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Indicates whether the media element is paused.
         *
         * @method getPaused
         * @return boolean
         */
        MediaElement.prototype.getPaused = function () {
            return this.element.paused;
        };
        Object.defineProperty(MediaElement.prototype, "paused", {
            /**
             * @property paused {boolean}
             */
            get: function () {
                return this.getPaused();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The default playback rate for the media. 1.0 is "normal speed," values lower than 1.0 make the media play slower
         * than normal, higher values make it play faster. The value 0.0 is invalid and throws a NOT_SUPPORTED_ERR exception.
         *
         * @throws NOT_SUPPORTED_ERR
         * @method getDefaultPlaybackRate
         * @return number
         */
        MediaElement.prototype.getDefaultPlaybackRate = function () {
            return this.element.defaultPlaybackRate;
        };
        Object.defineProperty(MediaElement.prototype, "defaultPlaybackRate", {
            /**
             * @property defaultPlaybackRate {number}
             */
            get: function () {
                return this.getDefaultPlaybackRate();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * If the playbackRate is negative, the media is played backwards. The audio is muted when the media plays backwards
         * or if the fast forward or slow motion is outside a useful range (E.g. Gecko mute the sound outside the range 0.25 and 5.0).
         *
         * @method getPlaybackRate
         * @return number
         */
        MediaElement.prototype.getPlaybackRate = function () {
            return this.element.playbackRate;
        };
        Object.defineProperty(MediaElement.prototype, "playbackRate", {
            /**
             * @property playbackRate {number}
             */
            get: function () {
                return this.getPlaybackRate();
            },
            /**
             * @property playbackRate {number}
             */
            set: function (value) {
                this.setPlaybackRate(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setPlaybackRate
         * @param value {number}
         */
        MediaElement.prototype.setPlaybackRate = function (value) {
            this.element.playbackRate = value;
        };
        /**
         * The ranges of the media source that the browser has played, if any.
         *
         * @method getPlayed
         * @return TimeRanges
         */
        MediaElement.prototype.getPlayed = function () {
            return this.element.played;
        };
        Object.defineProperty(MediaElement.prototype, "played", {
            get: function () {
                return this.getPlayed();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The time ranges that the user is able to seek to, if any.
         *
         * @method getSeekable
         * @return TimeRanges
         */
        MediaElement.prototype.getSeekable = function () {
            return this.element.seekable;
        };
        Object.defineProperty(MediaElement.prototype, "seekable", {
            /**
             * @property seekable {TimeRanges}
             */
            get: function () {
                return this.getSeekable();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Indicates whether the media element has ended playback.
         *
         * @method getEnded
         * @return boolean
         */
        MediaElement.prototype.getEnded = function () {
            return this.element.ended;
        };
        Object.defineProperty(MediaElement.prototype, "ended", {
            /**
             * @property error {boolean}
             */
            get: function () {
                return this.getEnded();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Reflects the autoplay HTML attribute, indicating whether playback should automatically begin as soon as enough
         * media is available to do so without interruption.
         *
         * @method getAutoplay
         * @return boolean
         */
        MediaElement.prototype.getAutoplay = function () {
            return this.element.autoplay;
        };
        Object.defineProperty(MediaElement.prototype, "autoplay", {
            /**
             * @property autoplay {boolean}
             */
            get: function () {
                return this.getAutoplay();
            },
            set: function (value) {
                this.setAutoplay(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setAutoplay
         * @return value {boolean}
         */
        MediaElement.prototype.setAutoplay = function (value) {
            this.element.autoplay = value;
        };
        /**
         * Reflects the loop HTML attribute, indicating whether the media element should start over when it reaches the end.
         *
         * @method getLoop
         * @return boolean
         */
        MediaElement.prototype.getLoop = function () {
            return this.element.loop;
        };
        Object.defineProperty(MediaElement.prototype, "loop", {
            /**
             * @property loop {boolean}
             */
            get: function () {
                return this.getLoop();
            },
            set: function (value) {
                this.setLoop(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method setLoop
         * @param value {boolean}
         */
        MediaElement.prototype.setLoop = function (value) {
            this.element.loop = value;
        };
        /**
         * Reflects the mediagroup HTML attribute, indicating the name of the group of elements it belongs to. A group of media elements shares a common controller.
         *
         * @method getMediaGroup
         * @return any
         */
        MediaElement.prototype.getMediaGroup = function () {
            return this.element['mediaGroup'];
        };
        Object.defineProperty(MediaElement.prototype, "mediaGroup", {
            /**
             * @property mediaGroup {any}
             */
            get: function () {
                return this.getMediaGroup();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Represents the media controller associated to the element, or null if none is linked to it.
         *
         * @method getController
         * @return any
         */
        MediaElement.prototype.getController = function () {
            throw new Error('no support yet');
            return this.element['controller'];
        };
        Object.defineProperty(MediaElement.prototype, "controller", {
            /**
             * @property controller {any}
             */
            get: function () {
                return this.getController();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback.
         *
         * @method setControls
         * @param value {boolean}
         * @return void
         */
        MediaElement.prototype.setControls = function (value) {
            this.element.controls = value;
        };
        Object.defineProperty(MediaElement.prototype, "controls", {
            set: function (value) {
                this.setControls(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The audio volume, from 0.0 (silent) to 1.0 (loudest).
         *
         * @method getVolume
         * @return number
         */
        MediaElement.prototype.getVolume = function () {
            return this.element.volume;
        };
        Object.defineProperty(MediaElement.prototype, "volume", {
            /**
             * @property volume {number}
             */
            get: function () {
                return this.getVolume();
            },
            set: function (value) {
                this.setVolume(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The audio volume, from 0.0 (silent) to 1.0 (loudest).
         *
         * @method setVolume
         * @param value {number}
         * @return void
         */
        MediaElement.prototype.setVolume = function (value) {
            // no support for ios
            if (Browser_1.default.ios || Browser_1.default.android) {
                throw new Error('no ios or android support');
            }
            this.element.volume = value;
        };
        /**
         * true if the audio is muted, and false otherwise.
         *
         * @method getMuted
         * @return boolean
         */
        MediaElement.prototype.getMuted = function () {
            return this.element.muted;
        };
        Object.defineProperty(MediaElement.prototype, "muted", {
            /**
             * @property error {MediaError}
             */
            get: function () {
                return this.getMuted();
            },
            set: function (value) {
                this.setMuted(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * true if the audio is muted, and false otherwise.
         *
         * @method setMuted
         * @param value {boolean}
         * @return void
         */
        MediaElement.prototype.setMuted = function (value) {
            // no support for ios
            if (Browser_1.default.ios) {
                throw new Error('no ios support');
            }
            this.element.muted = value;
        };
        /**
         * Reflects the muted HTML attribute, indicating whether the media element's audio output should be muted by default.
         * This property has no dynamic effect, to mute and unmute the audio output, use the muted property.
         *
         * @todo check support ie, opera, safari
         * @method getDefaultMuted
         * @return boolean
         */
        MediaElement.prototype.getDefaultMuted = function () {
            if (this.element['defaultMuted'] === void 0) {
                this.element['defaultMuted'] = false;
            }
            return this.element['defaultMuted'];
        };
        Object.defineProperty(MediaElement.prototype, "defaultMuted", {
            /**
             * @property defaultMuted {boolean}
             */
            get: function () {
                return this.getDefaultMuted();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Represents the list of AudioTrack objects contained in the element.
         *
         * @method getAudioTracks
         * @return any
         */
        MediaElement.prototype.getAudioTracks = function () {
            throw new Error('no support yet');
            return this.element['audioTracks'];
        };
        Object.defineProperty(MediaElement.prototype, "audioTracks", {
            /**
             * @property audioTracks {any}
             */
            get: function () {
                return this.getAudioTracks();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Represents the list of VideoTrack objects contained in the element.
         * Note: Yet Gecko supports only single track playback, and the parsing of tracks' metadata is only available for media with Ogg container foramt.
         *
         * @method getVideoTracks
         * @return any
         */
        MediaElement.prototype.getVideoTracks = function () {
            throw new Error('no support yet');
            return this.element['videoTracks'];
        };
        Object.defineProperty(MediaElement.prototype, "videoTracks", {
            /**
             * @property videoTracks {any}
             */
            get: function () {
                return this.getVideoTracks();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Represents the list of TextTrack objects contained in the element.
         *
         * @method getTextTracks
         * @return TextTrackList
         */
        MediaElement.prototype.getTextTracks = function () {
            throw new Error('no support yet');
            return this.element['textTracks'];
        };
        Object.defineProperty(MediaElement.prototype, "textTracks", {
            /**
             * @property textTracks {TextTrackList}
             */
            get: function () {
                return this.getTextTracks();
            },
            enumerable: true,
            configurable: true
        });
        MediaElement.prototype.addEventListener = function (type, listener, useCapture) {
            this.element.addEventListener(type, listener, useCapture);
        };
        MediaElement.prototype.addOnTime = function (time, listener) {
            var _this = this;
            var int;
            int = setInterval(function () {
                var currentTime = _this.element.currentTime;
                if (currentTime > time) {
                    listener.call(_this);
                    clearInterval(int);
                }
            }, 1000 / 60);
        };
        /**
         * @method removeEventListener
         * @param type {string} A string representing the event type to remove.
         * @param listener {Function} The EventListener function to remove from the event target.
         * @param useCapture {boolean} Specifies whether the EventListener to be removed was registered as a capturing listener or not. If this parameter is absent, a default value of false is assumed. If a listener was registered twice, one with capture and one without, each must be removed separately. Removal of a capturing listener does not affect a non-capturing version of the same listener, and vice versa. Note: useCapture was required in most major browsers' early versions. If broad compatibility is desired, you should always provide the useCapture parameter.
         */
        MediaElement.prototype.removeEventListener = function (type, listener, useCapture) {
            this.element.removeEventListener(type, listener, useCapture);
        };
        /**
         * Determines whether the specified media type can be played back.
         * Note: Previously canPlayType('video/webm') returned 'probably'. Starting with Gecko 28 (Firefox 28 / Thunderbird 28 / SeaMonkey 2.25 / Firefox OS 1.3), it returns 'maybe'.
         *
         * @method canPlayType
         * @param canPlayType {number}
         * @return {number}
         */
        MediaElement.prototype.canPlayType = function (value) {
            var can = this.element.canPlayType(value);
            switch (can) {
                case 'probably': {
                    return 0 /* PROBABLY */;
                    break;
                }
                case 'maybe': {
                    return 1 /* MAYBE */;
                    break;
                }
                default: {
                    return 2 /* NO */;
                    break;
                }
            }
        };
        /**
         * Method is experimental and should be used,
         * Directly seek to the given time.
         *
         * @method fastSeek
         * @return number
         */
        MediaElement.prototype.fastSeek = function (value) {
            this.element['fastSeek'](value);
        };
        /**
         * Begins playback of the media.
         *
         * @method play
         * @return void
         */
        MediaElement.prototype.play = function () {
            this.element.play();
        };
        /**
         * Pauses the media playback.
         *
         * @method pause
         * @return void
         */
        MediaElement.prototype.pause = function () {
            this.element.pause();
        };
        /**
         * Reset the media element and restart selecting the media resource.  Any pending events are discarded.  How much media
         * data is fetched is still affected by the preload attribute.  This method can be useful for releasing resources after
         * any src attribute and source element descendants have been removed.  Otherwise, it is usually unnecessary to use
         * this method, unless required to rescan source element children after dynamic changes.
         *
         * @method load
         * @return void
         */
        MediaElement.prototype.load = function () {
            this.element.load();
        };
        /**
         * @method setMediaKeys
         */
        MediaElement.prototype.setMediaKeys = function () {
            throw new Error('experimental');
        };
        /**
         * @event ontime
         * @param {string}
         */
        MediaElement.EVENT_ONTIME = 'ontime';
        /**
         * @event loadstart
         * @param {string}
         */
        MediaElement.EVENT_LOADSTART = 'loadstart';
        /**
         * @event emptied
         * @param {string}
         */
        MediaElement.EVENT_EMTIED = 'emptied';
        /**
         * @event canplaythrough
         * @param {string}
         */
        MediaElement.EVENT_CANPLAYTHROUGH = 'canplaythrough';
        /**
         * @event ended
         * @param {string}
         */
        MediaElement.EVENT_ENDED = 'ended';
        /**
         * @event ratechange
         * @param {string}
         */
        MediaElement.EVENT_RATECHANGE = 'ratechange';
        /**
         * @event progress
         * @param {string}
         */
        MediaElement.EVENT_PROGRESS = 'progress';
        /**
         * @event stalled
         * @param {string}
         */
        MediaElement.EVENT_STALLED = 'stalled';
        /**
         * @event playing
         * @param {string}
         */
        MediaElement.EVENT_PLAYING = 'playing';
        /**
         * @event durationchange
         * @param {string}
         */
        MediaElement.EVENT_DURATIONCHANGED = 'durationchange';
        /**
         * @event resize
         * @param {string}
         */
        MediaElement.EVENT_RESIZE = 'resize';
        /**
         * @event suspend
         * @param {string}
         */
        MediaElement.EVENT_SUSPEND = 'suspend';
        /**
         * @event loadedmetadata
         * @param {string}
         */
        MediaElement.EVENT_LOADMETADATA = 'loadedmetadata';
        /**
         * @event waiting
         * @param {string}
         */
        MediaElement.EVENT_WAITING = 'waiting';
        /**
         * @event timeupdate
         * @param {string}
         */
        MediaElement.EVENT_TIMEUPDATE = 'timeupdate';
        /**
         * @event volumechange
         * @param {string}
         */
        MediaElement.EVENT_VOLUMECHANGE = 'volumechange';
        /**
         * @event abort
         * @param {string}
         */
        MediaElement.EVENT_ABORT = 'abort';
        /**
         * @event loadeddata
         * @param {string}
         */
        MediaElement.EVENT_LOADEDDATA = 'loadeddata';
        /**
         * @event seeking
         * @param {string}
         */
        MediaElement.EVENT_SEEKING = 'seeking';
        /**
         * @event play
         * @param {string}
         */
        MediaElement.EVENT_PLAY = 'play';
        /**
         * @event error
         * @param {string}
         */
        MediaElement.EVENT_ERROR = 'error';
        /**
         * @event canplay
         * @param {string}
         */
        MediaElement.EVENT_CANPLAY = 'canplay';
        /**
         * @event seeked
         * @param {string}
         */
        MediaElement.EVENT_SEEKED = 'seeked';
        /**
         * @event pause
         * @param {string}
         */
        MediaElement.EVENT_PAUSE = 'pause';
        /**
         * @event encrypted
         * @param {string} only supported in chrome 42.0
         */
        MediaElement.EVENT_ENCRYPTED = 'encrypted';
        return MediaElement;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MediaElement;
});
