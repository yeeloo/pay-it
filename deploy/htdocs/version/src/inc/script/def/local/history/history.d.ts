declare var location:string;

export interface IState {
	data: Object;
	title: string;
	url: string;
}

/**
 * Pushes a new state to the browser; data can be null or an object, title can be null or a string, url must be a string
 */
declare function pushState( data:Object, title:string, url:string ):void;

/**
 * Replaces the existing state with a new state to the browser; data can be null or an object, title can be null or a string, url must be a string
 */
declare function replaceState( data:Object, title:string, url:string ):void;

/**
 * Gets the current state of the browser, returns an object with data, title and url
 */
declare function getState():IState;

/**
 * Gets the current hash of the browser
 */
declare function getHash():string;

declare var emulated:any;

declare var Adapter:IAdapter;
interface IAdapter {
	/**
	 * A framework independent event binder, you may either use this or your framework's native event binder.
	 */
	bind( element:any, event:string, callback:Function ): void;

	/**
	 * A framework independent event trigger, you may either use this or your framework's native event trigger.
	 */
	trigger( element:any, event:string ):void;

	/**
	 * A framework independent onDomLoad binder, you may either use this or your framework's native onDomLoad binder.
	 */
	onDomLoad( callback:Function ):void;
}

/**
 * Go back once through the history (same as hitting the browser's back button)
 */
declare function back();

/**
 * Go forward once through the history (same as hitting the browser's forward button)
 */
declare function forward();

/**
 * If X is negative go back through history X times, if X is positive go forwards through history X times
 */
declare function go( X );

/**
 * Logs messages to the console, the log element, and fallbacks to alert if neither of those two exist
 */
declare function log();
declare function log( value:any );

/**
 * Same as History.log but only runs if History.debug.enable === true
 */
declare function debug();
declare function debug( value:any );

