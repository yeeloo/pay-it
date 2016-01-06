define(["require", "exports", "bluebird", "../utils/Log"], function (require, exports, Promise, Log_1) {
    /**
     * Utility class for handling various destructible things like timeouts, promises, knockout subscriptions, etc.
     *
     * @module Temple
     * @namespace temple.core
     * @class DestructibleHelper
     * @constructor
     */
    var DestructibleHelper = (function () {
        function DestructibleHelper() {
            this._isDestructed = false;
            /**
             * list of registered intervals and timeouts, used for destruction
             *
             * @property _intervals
             * @protected
             */
            this._intervals = [];
            /**
             * list of Knockout subscriptions, used for destruction
             *
             * @property _subscriptions
             * @protected
             */
            this._subscriptions = [];
            /**
             * list of Knockout subscriptions, used for destruction
             *
             * @property _subscriptions
             * @protected
             */
            this._promises = [];
            /**
             * list of destructibles, like Event handlers, used for destruction
             *
             * @property _destructibles
             * @protected
             */
            this._destructibles = [];
        }
        DestructibleHelper.catchCancelablePromise = function (promise) {
            if (!promise.isCancellable()) {
                Log_1.default.error('promise is not cancellable', promise);
            }
            // add a catch handler only for when this promise is canceled
            // NOTE: for IE8, rename to 'caught'
            promise.catch(Promise.CancellationError, function (error) { return Log_1.default.log('Temple.Util.DestructibleHelper', 'canceled pending promise'); });
        };
        /**
         * Add an item that implements IDestructible
         *
         * @method add
         * @param destructible {IDestructible}
         * @returns {IDestructible}
         */
        DestructibleHelper.prototype.add = function (destructible) {
            this._destructibles.push(destructible);
            return destructible;
        };
        /**
         * Adds an interval
         *
         * @method addInterval
         * @param interval {number} id of the interval
         * @returns {number} id of the interval
         */
        DestructibleHelper.prototype.addInterval = function (interval) {
            this._intervals.push(interval);
            return interval;
        };
        /**
         * @method addKOSubscription
         * @param subscription {KnockoutSubscription}
         * @returns {KnockoutSubscription}
         */
        DestructibleHelper.prototype.addKOSubscription = function (subscription) {
            this._subscriptions.push(subscription);
            return subscription;
        };
        // utility method to save promises and add catch-cancelable handlers
        // should normally exists in the AbstractPageController
        /**
         * Adds a cancelable promise
         *
         * @method addPromise
         * @param promise {Promise}
         * @returns {Promise<any>}
         */
        DestructibleHelper.prototype.addPromise = function (promise) {
            DestructibleHelper.catchCancelablePromise(promise);
            this._promises.push(promise);
            return promise;
        };
        /**
         * Destructs all registered objects
         *
         * @method destruct
         */
        DestructibleHelper.prototype.destruct = function () {
            // clear intervals
            if (this._intervals) {
                for (var i = 0; i < this._intervals.length; i++) {
                    clearInterval(this._intervals[i]);
                }
                this._intervals.length = 0;
                this._intervals = null;
            }
            // clear subscriptions
            if (this._subscriptions) {
                for (var i = 0; i < this._subscriptions.length; i++) {
                    var subscription = this._subscriptions[i];
                    if (subscription) {
                        subscription.dispose();
                    }
                }
                this._subscriptions.length = 0;
                this._subscriptions = null;
            }
            // clear destructibles
            if (this._destructibles) {
                for (var i = 0; i < this._destructibles.length; i++) {
                    var destructible = this._destructibles[i];
                    if (destructible) {
                        destructible.destruct();
                    }
                }
                this._destructibles.length = 0;
                this._destructibles = null;
            }
            // clear promises
            if (this._promises) {
                for (var i = 0; i < this._promises.length; i++) {
                    var promise = this._promises[i];
                    if (promise &&
                        promise.cancellable() &&
                        promise.isPending()) {
                        promise.cancel();
                    }
                }
                this._promises.length = 0;
                this._promises = null;
            }
            this._isDestructed = true;
        };
        DestructibleHelper.prototype.isDestructed = function () {
            return this._isDestructed;
        };
        return DestructibleHelper;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DestructibleHelper;
});
