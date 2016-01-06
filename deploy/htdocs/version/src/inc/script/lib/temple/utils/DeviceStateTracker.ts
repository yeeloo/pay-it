/* tslint:disable:no-unused-variable */
import refdef = require('def/ReferenceDefinitions');
/* tslint:enable:no-unused-variable */
import {DeviceState, mediaQueries, reverseDeviceStateOrder} from 'app/data/scss-shared/MediaQueries';
import ThrottleDebounce from 'lib/temple/utils/ThrottleDebounce';
import ko = require('knockout');
import Destructible from "lib/temple/core/Destructible";

/**
 * Util class that tracks which media query is currently active using the
 * matchMedia API if available. If not available, it will use a state indicator
 * that updates using CSS.
 * The breakpoints are provided in a separate MediaQueries.js file, which is
 * shared with SCSS to generate the corresponding CSS.
 */
export default class DeviceStateTracker extends Destructible {
	/**
	 * Indicating if the browser supports the matchMedia API
	 */
	public supportsMatchMedia:boolean = false;
	/**
	 * Observable that holds the index of the currently active DeviceState in
	 * the DeviceState enum in MediaQueries.js.
	 */
	public currentState:KnockoutObservable<number> = ko.observable(null);
	/**
	 * Computed observable that holds the name of the currently active state as
	 * defined in the MediaQueries.js file.
	 */
	public currentStateName:KnockoutComputed<string>;
	/**
	 * Array of MediaQueryList instances for each device state. Only used if the
	 * matchMedia API is supported.
	 */
	private _queryLists:Array<MediaQueryList> = [];
	/**
	 * Array containing the name of each device state as defined in the
	 * MediaQueries.js file.
	 */
	private _deviceStateNames:Array<string> = [];
	/**
	 * Array containing a boolean for each device state that indicates if the
	 * media query currently matches. When multiple media queries match, we will
	 * set the state to the one with the largest index. Only used if the
	 * matchMedia API is supported.
	 */
	private _queryListMatches:Array<boolean> = [];
	/**
	 * Reference to a state-indicator element that will be used to read the
	 * currently active breakpoint if the matchMedia API is not supported.
	 */
	private _stateIndicator:HTMLDivElement = null;

	constructor()
	{
		super();

		this.initTracking();
		this.currentStateName = ko.computed<string>(() =>
		{
			var state = this.currentState();
			if(state === null) {
				return null;
			}

			return this._deviceStateNames[state];
		}, {pure: true});
	}

	/**
	 * Initializes tracking of media queries using matchMedia if supported, using
	 * a state indicator otherwise.
	 */
	private initTracking():void
	{
		this._deviceStateNames = Object.keys(DeviceState).filter((key) =>
		{
			return isNaN(parseInt(key, 10));
		});
		if(window.matchMedia) {
			this.supportsMatchMedia = true;
			this.initMatchMedia();
		}
		else {
			this.initStateIndicator();
		}
	}

	/**
	 * Loops through each deviceState and adds a matchMedia listener for each.
	 * Calls updateFromMatchMedia_ to initialize the current state.
	 */
	private initMatchMedia():void
	{
		this._queryLists = this._deviceStateNames.map<MediaQueryList>((stateName) =>
		{
			var mediaQuery = mediaQueries[stateName];
			if(!mediaQuery) {
				throw new Error(`DeviceState ${stateName} not found in the mediaQueries array.`);
			}
			return window.matchMedia(mediaQueries[stateName]);
		});

		this._queryLists.forEach((mql:MediaQueryList) =>
		{
			this._queryListMatches.push(mql.matches);
			mql.addListener(this.handleQueryChange);
		});

		this.updateFromMatchMedia();
	}

	/**
	 * Called whenever a MediaQueryList updates. Checks if the query matches
	 * and stores the result in the queryListMatches_ array. Then calls
	 * updateFromMatchMedia_() to find the current state from all matching
	 * queries.
	 * @param changedMql The MediaQueryList that changed
	 */
	private handleQueryChange = (changedMql:MediaQueryList):void =>
	{
		this._queryLists.forEach((mql:MediaQueryList, index:number) => {
			if(mql.media == changedMql.media) {
				this._queryListMatches[index] = changedMql.matches;
			}
		});

		this.updateFromMatchMedia();
	};

	/**
	 * Takes the results from the matchMedia event listeners saved in the
	 * queryListMatches_ property. Sets the last one in the array as the active
	 * query. When the reverseDeviceStateOrder boolean is set to true, will
	 * set the first one in this array.
	 */
	private updateFromMatchMedia():void
	{
		var numQueries = this._queryListMatches.length;

		for(var i = 0; i < numQueries; i++) {
			var index = reverseDeviceStateOrder ? i : numQueries - 1 - i;

			if(this._queryListMatches[index]) {
				this.currentState(index);
				break;
			}
		}
	}

	/**
	 * Initializes tracking of the current media query using a state indicator
	 * element. This element will hold the state name as content inside its
	 * :before pseudo-element. On window resize, we will check the contents
	 * of the pseudo-element to read the current state.
	 */
	private initStateIndicator():void
	{
		this._stateIndicator = document.createElement('div');
		this._stateIndicator.className = 'state-indicator';
		document.body.appendChild(this._stateIndicator);

		$(window).on('resize' + this.eventNamespace,
			ThrottleDebounce.debounce(this.updateFromStateIndicator,
				100, this));

		this.updateFromStateIndicator();
	}

	/**
	 * Called on window resize. Reads the current state from the state indicator
	 * element. Only used if the matchMedia API is unavailable.
	 */
	private updateFromStateIndicator():void
	{
		var stateContent = window.getComputedStyle(this._stateIndicator, ':before').
		getPropertyValue('content');
		var state = parseInt(stateContent.replace(/['"]/g, ''), 10);

		this.currentState(state);
	}

	/**
	 * Destruct this DeviceStateTracker instance and remove any event listeners.
	 */
	public destruct():void
	{
		$(window).off(this.eventNamespace);
		this._queryLists.forEach((query:MediaQueryList) =>
		{
			query.removeListener(this.handleQueryChange);
		});
		this._queryLists.length = 0;

		super.destruct();
	}
}