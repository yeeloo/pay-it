import refdef from 'def/ReferenceDefinitions';
import Browser from './Browser';
import Cookie from './Cookie';
import RegExpUtils from './types/RegExpUtils';
import StringUtils from './types/StringUtils';

/**
 * This interface describes the possible configuration parameters that can be passed to the
 * {{#crossLink "temple.utils.log.Log"}}Log{{/crossLink}} constructor
 *
 * @namespace temple.utils.log
 * @class ILogFeatures
 * @contributors Stuart van Beek
 * @constructor
 * @param {string} ns
 * @param {ILogFeatures} [features]
 */
export interface ILogFeatures
{
	/**
	 * Enable to show a timestamp when logging
	 *
	 * @default false
	 * @property {boolean} time
	 */
	time?:boolean;

	/**
	 * Enable to show a datestamp when logging.
	 *
	 * @default false
	 * @property {boolean} date
	 */
	date?:boolean;

	/**
	 * Enable to show the amount of time elapsed since the last log call of the instance of
	 * {{#crossLink "temple.utils.log.Log"}}Log{{/crossLink}}
	 *
	 * @default false
	 * @property {boolean} timeDiff
	 */
	timeDiff?:boolean;

	/**
	 * Set to `false` to disable logging of the namespace string
	 *
	 * @default true
	 * @property {boolean} showNamespaceString
	 */
	showNamespaceString?:boolean;

	/**
	 * Sets the color of the prefixed logging string (e.g. the namespace, timestamp, etc)
	 *
	 * @default #8c8c8c
	 * @property {string} color
	 */
	color?:string;
}


/**
 * The name of the cookie to check
 *
 * @type {string}
 * @private
 */
var _cookieName:string = '__debug__';

/**
 * List of methods to polyfill
 * @type {string[]}
 * @private
 */
var _polyfillMethods = [
	'count',
	'debug',
	'dir',
	'dirxml',
	'error',
	'info',
	'log',
	'trace',
	'warn'
];

var _registeredNamespaces:Array<string> = [];

// we'll store the cookie regexp and the cookie value, so we can check if the current cookie is the same as the old value
// and prevent regenerating the RegExp
var _cachedCookieValue:string;
var _cachedGlobRegExp:RegExp;

/**
 * Provides a namespaced debugging utility that exposes common Console functions (e.g. log, error, warn, etc). Every
 * instance of Log should be given a namespace string (e.g. `MyApp.MyUtility.SomeComponent`). When a Console method is
 * called, Log will first read the cookie `__debug__` and check if the namespace matches the cookie value. When the
 * cookie matches the namespace, it will run the function.
 *
 * The cookie value should be a pipe (`|`) delimited string containing wildcards, e.g.
 * `'MyApp.SomeUtil.*|MyApp.OtherUtil.Component.*'`
 *
 * Log also provides additional features atop the regular Console API. Log can log the date and time of the log, and
 * the amount of milliseconds that have elapsed since the last log call. It will also log the namespace.
 *
 * **Log example with all features enabled:**
 *
 *     [MyUtility.SomeComponent] [03-02-1970 12:00:00] [200ms] Hello world!
 *
 * Some static methods are available that allow you to update the cookie. To enable calling this class from the console,
 * run the following (or add it to a bookmarklet):
 *
 *     require(['lib/temple/utils/Log'], function(Log) { window.Log = Log.default; });
 *
 * To improve your logging experience, enable
 * [Framework Blackboxing](https://developer.chrome.com/devtools/docs/blackboxing) for this library. This will show the
 * file and line number of the place the log method was called from, instead of linking to this library.
 *
 * @namespace temple.utils.log
 * @class Log
 * @contributors Stuart van Beek
 * @constructor
 * @param namespace {string} The namespace to associate to the instance of the class
 * @param features {temple.utils.log.ILogFeatures} the features enabled for this instance of the class
 */
class Log
{
	private static defaultFeatures:ILogFeatures = {
		showNamespaceString: true,
		time: false,
		date: false,
		timeDiff: false,
		color: '#8c8c8c'
	};

	/**
	 * Add a namespace to the cookie
	 *
	 * @static
	 * @method addNamespaceToCookie
	 * @param namespace {string}
	 */
	public static addNamespaceToCookie(namespace:string):void
	{
		if(Log.getCookieValue() == void 0)
		{
			Cookie.set(_cookieName, namespace);

			return
		}

		Cookie.set(_cookieName, Cookie.get(_cookieName) + '|' + namespace);
	}

	/**
	 * Static method for calling console.log under a certain namespace, useful for one-off logs
	 *
	 * @method log
	 * @static
	 * @param namespace {string} namespace
	 * @param items {Array<string>}
	 */
	public static log(namespace:string, ...items:Array<any>):void
	{
		Log.runConsoleMethod('log', namespace, void 0, ...items);
	}

	/**
	 * Static method for calling console.info under a certain namespace, useful for one-off logs
	 *
	 * @method info
	 * @static
	 * @param namespace {string} namespace
	 * @param items {Array<string>}
	 */
	public static info(namespace:string, ...items:Array<any>):void
	{
		Log.runConsoleMethod('info', namespace, void 0, ...items);
	}

	/**
	 * Static method for calling console.warn under a certain namespace, useful for one-off logs
	 *
	 * @method warn
	 * @static
	 * @param namespace {string} namespace
	 * @param items {Array<string>}
	 */
	public static warn(namespace:string, ...items:Array<any>):void
	{
		Log.runConsoleMethod('warn', namespace, void 0, ...items);
	}

	/**
	 * Static method for calling console.error under a certain namespace, useful for one-off logs
	 *
	 * @method error
	 * @static
	 * @param namespace {string} namespace
	 * @param items {Array<string>}
	 */
	public static error(namespace:string, ...items:Array<any>):void
	{
		Log.runConsoleMethod('warn', namespace, void 0, ...items);
	}

	/**
	 * Remove a namespace from the cookie
	 *
	 * @static
	 * @method removeNamespaceFromCookie
	 * @param namespace {string}
	 */
	public static removeNamespaceFromCookie(namespace:string):void
	{
		if(Log.getCookieValue() == void 0)
		{
			return;
		}

		let values = Log.getCookieValue().split('|');
		if(values.indexOf(namespace) == -1)
		{
			return;
		}

		values.splice(values.indexOf(namespace), 1);

		Log.setCookieValue(values.join('|'));
	}

	/**
	 * Returns the current value of the cookie
	 *
	 * @static
	 * @method getCookieValue
	 * @returns {string}
	 */
	public static getCookieValue():string
	{
		return Cookie.get(_cookieName);
	}

	/**
	 * Directly sets the value of the cookie and overwrites the current value
	 *
	 * @static
	 * @method setCookieValue
	 * @param value
	 */
	public static setCookieValue(value:string):void
	{
		return Cookie.set(_cookieName, value);
	}

	/**
	 * Clears the cookie
	 *
	 * @static
	 * @method removeAllNamespaces
	 */
	public static removeAllNamespaces():void
	{
		Cookie.remove(_cookieName);
	}

	/**
	 * returns an array of registered namespaces
	 *
	 * @static
	 * @method getAllNamespaces
	 * @returns {Array<string>}
	 */
	public static getAllNamespaces():Array<string>
	{
		return _registeredNamespaces;
	}

	/**
	 * Enables logging for all namespaces (e.g. *)
	 *
	 * @static
	 * @method enableAllLogs
	 */
	public static enableAllLogs():void
	{
		Log.removeAllNamespaces();
		Log.addNamespaceToCookie('*');
	}

	/**
	 * Runs a
	 * @param method
	 * @param namespace
	 * @param items
	 */
	private static runConsoleMethod(method:string, namespace:string, features:ILogFeatures = Log.defaultFeatures, ...items:Array<any>)
	{
		if(Log.checkCookieAgainstNamespace(namespace) == false)
		{
			return;
		}

		var prefix = Log.getConsolePrefix(namespace, features);

		let prefixArr = [];

		if(prefix != void 0 && features.color != void 0 && this.supportsConsoleColors() == true)
		{
			prefixArr = [`%c${prefix}`, `color: ${features.color}`];
		}
		else if(prefix != void 0)
		{
			prefixArr = [prefix];
		}

		if(console[method] == void 0)
		{
			method = 'log';
		}

		// call method with the prefix and the supplied arguments
		console[method].apply(console, prefixArr.concat(items));
	}

	/**
	 * Returns `true` if the glob pattern in the cookie matches the given namespace
	 *
	 * @method checkCookieAgainstNamespace
	 * @private
	 * @param namespace {string} namespace
	 * @returns {boolean}
	 */
	private static checkCookieAgainstNamespace(namespace:string):boolean
	{
		var cookieValue = Cookie.get(_cookieName);

		if(cookieValue == void 0)
		{
			return false;
		}

		if(_cachedCookieValue == void 0 || _cachedCookieValue != cookieValue)
		{
			// cache the cookie to prevent regenerating cookies on every log call
			_cachedCookieValue = cookieValue;
			_cachedGlobRegExp = RegExpUtils.globToRegExp(`${cookieValue}`, {extended: true, flags: ['i']});
		}

		return _cachedGlobRegExp.test(namespace);
	}

	/**
	 * Returns true if the UserAgent's Console implementation supports colors
	 *
	 * @method supportsConsoleColors
	 * @private
	 * @returns {boolean}
	 */
	private static supportsConsoleColors():boolean
	{
		return Browser.chrome == true; // currently only chrome supports it
	}

	/**
	 * Returns a string of all combined features (e.g. namespace string, timestamp, etc) for logging.
	 * Returns `undefined` if no features are enabled.
	 *
	 * @private
	 * @method getConsolePrefix
	 * @returns string
	 */
	private static getConsolePrefix(namespace:string, features:ILogFeatures, lastLogTime?:number):string
	{
		var consoleNsString:string;

		if(features.showNamespaceString == true)
		{
			consoleNsString = `[${namespace}]`;
		}

		if(features.date == true || features.time == true)
		{
			var date = new Date();

			var year = date.getFullYear();
			var month = StringUtils.padLeft((date.getMonth() + 1).toString(), 2, '0');
			var day = StringUtils.padLeft(date.getDate().toString(), 2, '0');

			var hours = StringUtils.padLeft(date.getHours().toString(), 2, '0');
			var minutes = StringUtils.padLeft(date.getMinutes().toString(), 2, '0');
			var seconds = StringUtils.padLeft(date.getSeconds().toString(), 2, '0');

			// if both date and time are enabled, show it as a single prefix: [hh:mm:ss dd-mm-yyyy]
			if(features.date == true && features.time == true)
			{
				consoleNsString = `${consoleNsString} [${hours}:${minutes}-${seconds} ${day}-${month}-${year}]`;
			}
			// show only date: [dd-mm-yyyy]
			else if(features.date == true)
			{
				consoleNsString = `${consoleNsString} [${day}-${month}-${year}]`;
			}
			// show only time: [hh:mm:ss]
			else if(features.time == true)
			{
				consoleNsString = `${consoleNsString} [${hours}:${minutes}-${seconds}]`;
			}
		}

		if(features.timeDiff == true && lastLogTime != void 0)
		{
			var now = Date.now();
			// time difference in ms since last log, or 0 if there has been no log
			var diff = lastLogTime == void 0 ? 0 : now - lastLogTime;
			consoleNsString = `${consoleNsString} [${diff}ms]`;
		}

		return consoleNsString;
	}

	/**
	 * The amount of milliseconds since the last log call
	 *
	 * @private
	 * @property {number} _lastLogTime
	 */
	private _lastLogTime:number;

	private _features:ILogFeatures;
	private _namespace:string;

	constructor(namespace:string, features?:ILogFeatures)
	{
		this._namespace = namespace;

		if(_registeredNamespaces.indexOf(namespace) == -1)
		{
			_registeredNamespaces.push(namespace);
		}

		// TODO remove this <any> typing when ES6 lib.d.ts is used
		this._features = (<any> Object).assign({}, Log.defaultFeatures, features);

		// replace the methods to be polyfilled with methods that check the namespace and prepend the features prefix.
		_polyfillMethods.forEach((method) => this.applyConsoleMethod(method));
	}

	/**
	 * Changes the namespace of the Log object
	 * @param namespace {string}
	 */
	public setNamespace(namespace:string):void
	{
		this._namespace = namespace;
	}

	/**
	 * Note: these methods are stubs. They are replaced when Log is initialized. They're here to provide proper typing
	 * to the compiler.
	 */

	/**
	 * Writes the the number of times that `count()` has been invoked at the same line and with the same label.
	 *
	 * @method count
	 * @param {string} [countTitle]
	 */
	public count(countTitle?:string):void
	{
	}

	/**
	 * This method is identical to {{#crossLink "temple.utils.log.Log/log:method"}}log{{/crossLink}}.
	 *
	 * @method debug
	 * @param {any} [items]
	 */
	public debug(items?:any):void
	{
	}

	/**
	 * Prints a JavaScript representation of the specified object. If the object being logged is an HTML element, then
	 * the properties of its DOM representation are displayed.
	 *
	 * @method dir
	 * @param {any} [value]
	 */
	public dir(value?:any):void
	{
	}

	/**
	 * Prints an XML representation of the specified object, as it would appear in the Elements panel. For HTML
	 * elements, calling this method is equivalent to calling
	 * {{#crossLink "temple.utils.log.Log/log:method"}}log{{/crossLink}}.
	 *
	 * @mthod dirxml
	 * @param {any} [value]
	 */
	public dirxml(value?:any):void
	{
	}

	/**
	 * Similar to {{#crossLink "temple.utils.log.Log/log:method"}}log{{/crossLink}},
	 * {{#crossLink "temple.utils.log.Log/error:method"}}error{{/crossLink}} and also includes a stack trace from where
	 * the method was called.
	 *
	 * @method error
	 * @param {any} [items]
	 */
	public error(...items:Array<any>):void
	{
	}

	/**
	 * This method is identical to {{#crossLink "temple.utils.log.Log/log:method"}}log{{/crossLink}}.
	 *
	 * @method info
	 * @param {any} [items]
	 */
	public info(...items:Array<any>):void
	{
	}

	/**
	 * Displays a message in the console. You pass one or more objects to this method, each of which are evaluated and
	 * concatenated into a space-delimited string. The first parameter you pass to `log()` may contain format
	 * specifiers, a string token composed of the percent sign (%) followed by a letter that indicates the formatting
	 * to be applied.
	 *
	 * @method log
	 * @param {any} [items]
	 */
	public log(...items:Array<any>):void
	{
	}

	/**
	 * Prints a stack trace from the point where the method was called, including links to the specific lines in the
	 * JavaScript source. A counter indicates the number of times that trace() method was invoked at that point, as
	 * shown in the screen shot below.
	 *
	 * @method trace
	 */
	public trace():void
	{
	}

	/**
	 * This method is like {{#crossLink "temple.utils.log.Log/log:method"}}log{{/crossLink}} but also displays a
	 * yellow warning icon along with the logged message.
	 *
	 * @method warn
	 * @param {any} [items]
	 */
	public warn(...items:Array<any>):void
	{
	}

	/**
	 * Proxies a console method to the instance of Log, adding the prefix string and checking for the namespace cookie.
	 * Methods default to console.log when the method does not exist in the UserAgent's implementation of Console
	 *
	 * @private
	 * @method applyConsoleMethod
	 * @param {string} method
	 */
	private applyConsoleMethod(method:string):void
	{
		this[method] = (...args:Array<any>) =>
		{
			Log.runConsoleMethod(method, this._namespace, this._features, ...args);
			this._lastLogTime = Date.now();
		};
	}
}

export default Log;