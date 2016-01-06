import refdef from "def/ReferenceDefinitions";

import Promise = require("bluebird");
import Destructible from "lib/temple/core/Destructible";
import IGatewayResult from "./result/IGatewayResult";
import IGatewayError from "./result/IGatewayError";

import IGateway from "./IGateway";
import IGatewayOptions from "./IGatewayOptions";
import IGatewayCallOptions from "./IGatewayCallOptions";
import CachedCall from "./CachedCall";
import Log from 'lib/temple/utils/Log';

/**
 * The Gateway class is used to communicate to the backend. You will probably not use this class directly,
 * but instead use {{#crossLink "AbstractService"}}the Service classes{{/crossLink}} to create a typed API.
 *
 * The Gateway uses jQuery XHR to execute the XHR requests, and Bluebird promises to listen to the response.
 *
 * The Gateway follows the MediaMonks REST API spec:
 * [https://docs.google.com/document/d/14HjqGMzeu48Q1kkniIvostMbiVZ5LbLcZmA-1PDfX3Q/edit](https://docs.google.com/document/d/14HjqGMzeu48Q1kkniIvostMbiVZ5LbLcZmA-1PDfX3Q/edit)
 *
 * Setup
 * -----
 * The Gateway is created in the DataManager:
 * ```
 * this.gateway = new Gateway({
 *      // the base url
 *      url: ConfigManager.getInstance().getUrl('api'),
 *      headers: {
 *      	'X-Force-Status-Code-200': 1
 *      },
 *      // the default output handler (can be changed to PostOutputHandler or JSONOutputHandler for the 'old gateway',
 *      // or to RESTOutputHandler for the 'new style')
 *      outputHandler: new RESTOutputHandler(),
 *      inputHandler: new RESTInputHandler()
 * }, true);
 * ```
 * You can pass any of the properties from [http://api.jquery.com/jquery.ajax/](jQueryAjaxSettings).
 * Besides those, the object is extended to {{#crossLink "IGatewayOptions"}}{{/crossLink}} which ads several more options.
 *
 * The options passed into the Gateway constructor are merged with the options that can be passed for each request, and used for jQuery.ajax().
 *
 * For current projects, the is no defined spec for communication, besides success and data fields.
 * Stuff like Pagination and Validation errors are not defined, so can be different per project.
 * For those projects the {{#crossLink "LegacyInputHandler"}}{{/crossLink}} can be used, replace it as inputHandler in the Gateway constructor above.
 * Please note that pagination and validation should be mapped by the developer.
 *
 * For newer backend APIs, the current {{#crossLink "RESTInputHandler"}}{{/crossLink}} can be used.
 *
 * Request
 * -------
 * To execute a Gateway call, create a typed method in your Service, and call one of the Gateway methods from there:
 * ```
 * public getUsers():Promise<IGatewayResult<User>>
 * {
 *      return this.gateway.get('/users');
 * }
 *
 * public createUser(user:User):Promise<IGatewayResult<User>>
 * {
 *      return this.gateway.post('/users', user);
 * }
 * ```
 *
 * And from your code you would invoke that method:
 * ```
 * userService.getUsers()
 *      .then((result:IGatewayResult<User>) =>
 *      {
 *          console.log(result.data);
 *      })
 *      .catch((error:IGatewayError) =>
 *      {
 *          console.log(error.error.code, error.error.message);
 *      });
 *
 * userService.createUser({username: "johndoe", password: "qwerty"})
 *      .then((result:IGatewayResult<User>) =>
 *      {
 *          console.log(result.data);
 *      })
 *      .catch((error:IGatewayError) =>
 *      {
 *          console.log(error.error.code, error.error.message, error.error.fields);
 *      });
 * ```
 *
 * Cleanup
 * -------
 * It is good practice to remove running Gateway calls when leaving the page.
 * Because you don't want to do that manually you can add the promise to the DestructibleHelper so it will be canceled and cleaned up when the page is destructed.
 * ```
 * this.destructibles.addPromise(userService.getUsers()
 *      .then((result:IGatewayResult<User>) =>
 *      {
 *          console.log(result.data);
 *      }));
 * ```
 *
 * Cross- domain/protcol and IE8/9
 * ------------------------------
 * When dealing with older browsers that don't support cross- domain or protocol communication using CORS headers, we need to do things a little differently.
 *
 * For GET requests, we can easily fallback to JSONP.
 *
 * For POST requests, we can post the form to an hidden iframe, and send back the response via postMessage.
 *
 * TODO: move to other package / folder
 *
 * @module Gateway
 * @class Gateway
 * @extends Destructible
 */
class Gateway extends Destructible implements IGateway
{
	private _runningCalls:{
		[key: string]: Promise<IGatewayResult<any>>
	} = {};
	private _cachedCalls:{
		[key: string]: CachedCall;
	} = {};
	private _options:IGatewayOptions;

	private _log = new Log('app.net.Gateway');

	/**
	 * When debugging is enabled, data will be outputted in the console for each request.
	 * @attribute {boolean} debug
	 */
	public debug:boolean;

	/**
	 * @constructor
	 * @class Gateway
	 * @param {IGatewayOptions} options Extends the jQuery AjaxSettings object, this will be merged with the same options object that can be specified per call, and passed to the $.ajax when a request is done.
	 * @param {boolean} debug
	 */
	constructor(options?:IGatewayOptions, debug:boolean = false)
	{
		super();

		this._options = <IGatewayOptions>$.extend({}, {
			// in production we want to disable cache-buster parameters because they break cdns
			cache: true,
			// we like json by default (because some endpoints return plain/text for IE-download-bug)
			dataType: 'json'
		}, options);

		this.debug = debug && DEBUG;

		if (!this._options.outputHandler)
		{
			this._log.warn('missing property outputHandler in Gateway options, falling back to default behavior');
		}

		// in debug mode we want to revert the default value above, so we can test without cache.
		if (this.debug)
		{
			this._options.cache = undefined;
		}
	}

	/**
	 * Returns the passed options
	 *
	 * @method getOptions
	 * @returns {IGatewayOptions}
	 */
	public getOptions():IGatewayOptions
	{
		return this._options;
	}

	/**
	 * Sets global options
	 *
	 * @method setOptions
	 * @param options {IGatewayOptions} global gateway options
	 */
	public setOptions(options:IGatewayOptions):void
	{
		this._options = options;
	}

	/**
	 * GET shorthand for the execute method
	 *
	 * @method get
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayCallOptions} options
	 */
	public get(action:string, data:any = null, options: IGatewayCallOptions = {}):Promise<IGatewayResult<any>>
	{
		options = $.extend(true, {type: Method.GET}, this._options, options);
		options.cacheKey = options.cacheKey || options.jsonpCallback || (options.url + action + btoa(JSON.stringify(data)));

		// ignore duplicate calls
		if (this._runningCalls[options.cacheKey])
		{
			this._log.error('duplicate call: ', options.cacheKey);
			return this._runningCalls[options.cacheKey];
		}

		// check cached call
		var p:Promise<IGatewayResult<any>> = this.checkCachedCall(options);
		if (p)
		{
			this._log.info('result \'' + action + '\' coming from cache!');
			return p;
		}

		return this.execute(action, data, options);
	}

	/**
	 * Checks if there is a cached call that can be returned instead of doing an actual request.
	 *
	 * @method checkCachedCall
	 * @private
	 * @param {IGatewayCallOptions} options
	 * @returns {any}
	 */
	private checkCachedCall(options:IGatewayCallOptions):Promise<IGatewayResult<any>>
	{
		if (this._cachedCalls[options.cacheKey])
		{
			var cc:CachedCall = this._cachedCalls[options.cacheKey];

			// cache is expired, invalidate cache
			if (cc.isExpired())
			{
				delete this._cachedCalls[options.cacheKey];
			}
			// we hit the cache, return the cached response asynchronously
			else
			{
				return new Promise<IGatewayResult<any>>((resolve: (result: IGatewayResult<any>) => void, reject: (error: any) => void) =>
				{
					resolve(JSON.parse(cc.result));
				});
			}
		}

		return null;
	}

	/**
	 * POST shorthand for the execute method
	 *
	 * @method post
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayCallOptions} options
	 * @return {Promise} A IGatewayResult<any> Promise
	 */
	public post(action:string, data:any, options: IGatewayCallOptions = {}):Promise<IGatewayResult<any>>
	{
		options = $.extend(true, {type: Method.POST}, this._options, options);

		return this.execute(action, data, options);
	}

	/**
	 * PUT shorthand for the execute method
	 *
	 * @method put
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayCallOptions} options
	 * @return {Promise} A IGatewayResult<any> Promise
	 */
	public put(action:string, data:any, options: IGatewayCallOptions = {}):Promise<IGatewayResult<any>>
	{
		options = $.extend(true, {type: Method.PUT}, this._options, options);

		return this.execute(action, data, options);
	}

	/**
	 * PATCH shorthand for the execute method
	 *
	 * @method patch
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayCallOptions} options
	 * @return {Promise} A IGatewayResult<any> Promise
	 */
	public patch(action:string, data:any, options: IGatewayCallOptions = {}):Promise<IGatewayResult<any>>
	{
		options = $.extend(true, {type: Method.PATCH}, this._options, options);

		return this.execute(action, data, options);
	}

	/**
	 * DELETE shorthand for the execute method
	 *
	 * @method delete
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayCallOptions} options
	 * @return {Promise} A IGatewayResult<any> Promise
	 */
	public delete(action:string, data:any = null, options: IGatewayCallOptions = {}):Promise<IGatewayResult<any>>
	{
		// NOTE: for IE8, rename to 'del'

		options = $.extend(true, {type: Method.DELETE}, this._options, options);

		return this.execute(action, data, options);
	}

	/**
	 * Executes the gateway request
	 *
	 * @method execute
	 * @param {string} action
	 * @param {any} data
	 * @param {IGatewayCallOptions} options
	 * @return {Promise} A IGatewayResult<any> Promise
	 */
	public execute(action:string, data:any = {}, options: IGatewayCallOptions = {}):Promise<IGatewayResult<any>>
	{
		this._log.log('execute', action, data);

		// for when this method was called directly
		options = $.extend(true, {}, this._options, options);

		// missing url
		if (!this._options.url)
		{
			throw new Error('missing property url in Gateway options');
		}

		// missing request method
		if (!options.type)
		{
			throw new Error("Missing HTTP request method, please provide via the 'options.type'");
		}

		// replace {var} in the url with data.var or options.var, or {action} with the passed action.
		options.url = options.url.replace(/\{([^}]+)\}/gi, (result, match) =>
		{
			return match == 'action' ? action : (data[match] || options[match] || match);
		});

		// format data
		if (options.outputHandler)
		{
			options.data = options.outputHandler.format(action, data, options);
		}
		else
		{
			options.data = data;
		}

		// if we have a callback, we want to do jsonp
		if (options.dataType == void 0 && options.jsonpCallback)
		{
			options.dataType = "jsonp";
		}
		// if we are doing jsop, we need this as a default
		if (options.crossDomain == void 0 && options.dataType == "jsonp")
		{
			// if we don't do this, same-domain requests will not be executed as jsonp, but as regular json
			options.crossDomain = true
		}

		this._log.log('options: ', options);

		var jqXHR = $.ajax(options);

		var p = new Promise<IGatewayResult<any>>((resolve: (result: IGatewayResult<any>) => void, reject: (error: IGatewayError) => void) =>
		{

			jqXHR.then(
				(data, textStatus, jqXHR) =>
				{
					delete this._runningCalls[options.cacheKey];

					var response:IGatewayResult<any>;
					if(options.inputHandler)
					{
						response = options.inputHandler.format(data);
					}
					else
					{
						response = data;
					}

					// store result in cache when appropriate
					if (options.type == Method.GET && options.cacheMaxAge)
					{
						this._cachedCalls[options.cacheKey] = new CachedCall(options.cacheKey, JSON.stringify(response), options.cacheMaxAge);
					}

					if (response && (<IGatewayError>response).error)
					{
						reject(<IGatewayError>response);
					}
					else
					{
						resolve(response);
					}
				},
				(jqXHR, textStatus, errorThrown) =>
				{
					delete this._runningCalls[options.cacheKey];

					var response = null;
					try
					{
						response = JSON.parse(jqXHR.responseText);
					}
					catch (error)
					{
						// ignore
					}

					if (response && options.inputHandler)
					{
						response = options.inputHandler.format(response);
					}

					reject(response ? response : {
						error: {
							code: 'server-error',
							message: (textStatus + ' - ' + errorThrown)
						}
					});
				}
			);
		})
		.cancellable()
		// NOTE: for IE8, rename to 'caught'
		.catch<IGatewayResult<any>>(Promise.CancellationError, (error:any):any =>
		{
			// if a promise is canceled, this catch is invoked, so we can cancel the request.

			this._log.log('canceled pending request');

			// abort the request
			jqXHR.abort();

			// rethrow the error to stop the promise chain
			throw error;
		});

		// log call as running
		this._runningCalls[options.cacheKey] = p;

		return p
	}
}

export default Gateway;

class Method
{
	static GET:string = "get";
	static POST:string = "post";
	static PUT:string = "put";
	static PATCH:string = "patch";
	static DELETE:string = "delete";
}