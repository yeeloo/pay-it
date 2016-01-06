/**
 * Util class with 2 static methods to create functions that rate-limit a
 * given callback.
 */
export default class ThrottleDebounce {
	/**
	 * Returns a proxy function that rate-limits the given callback. Will
	 * execute every 'limit' milliseconds as long as the proxy function
	 * is called. The last execution will always be after the last time the
	 * proxy function is called.
	 * @param {function} callback The function to limit the execution rate on.
	 * @param {number} limit The minimal time in milliseconds between
	 *     function calls.
	 * @param {Object=} scope The scope to execute the callback on. Defaults to
	 * 'window'.
	 * @returns {function} The proxy function
	 */
	public static throttle(callback:Function, limit:number,
	                       scope:any = window) {

		return ThrottleDebounce._throttleDebounce(callback, limit, scope, false);
	}

	/**
	 * Returns a proxy function that will only execute the given callback once,
	 * after the proxy function has not been called for a specific amount of
	 * time.
	 * @param {function} callback The function to limit the execution rate on.
	 * @param {number} threshold The time in milliseconds the proxy function
	 *     will wait before executing the callback.
	 * @param {Object=} scope The scope to execute the callback on. Defaults to
	 * 'window'.
	 * @returns {function} The proxy function
	 */
	public static debounce(callback:Function, threshold:number,
	                       scope:any = window) {

		return ThrottleDebounce._throttleDebounce(callback, threshold,
			scope, true);
	}

	/**
	 * Helper function for debounce and throttle methods because they have
	 * very similar functionality. See those methods for parameter description.
	 * @param {function} callback
	 * @param {number} threshold
	 * @param {Object} scope
	 * @param {boolean} isDebounce
	 * @returns {function}
	 * @private
	 */
	private static _throttleDebounce(callback:Function, threshold:number,
	                                 scope:any, isDebounce:boolean) {
		var proxyTimeout:number;
		var lastTime:number = 0;

		var proxy = function () {
			var now = (new Date()).getTime();
			var elapsed = now - lastTime;
			var args = arguments;

			var execute = function () {
				lastTime = (new Date()).getTime();
				callback.apply(scope, args);
			};

			if (isDebounce || (lastTime && elapsed < threshold)) {
				if (proxyTimeout) {
					window.clearTimeout(proxyTimeout);
				}

				var timeUntilNext = isDebounce ? threshold : threshold - elapsed;
				proxyTimeout = window.setTimeout(execute, timeUntilNext);
			} else if (!isDebounce) {
				execute();
			}
		};

		return proxy;
	}
}