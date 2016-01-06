// todo: add automatich destruction of intervals, gateway PendingCalls, knockout subscriptions and components
define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.core
     * @class Destructible
     */
    var Destructible = (function () {
        function Destructible() {
            this._isDestructed = false;
            /**
             * @property eventNamespace
             * @type string
             * @default
             */
            this.eventNamespace = '';
            this.eventNamespace = '.' + (++Destructible.eventNamespaceCount);
        }
        /**
         * After {{#crossLink "temple.core.Destructible/destruct"}}{{/crossLink}} has been called, this method returns true.
         * Use this method to determine whether destruct() should be run again.
         *
         * @public
         * @method isDestructed
         * @returns {boolean}
         */
        Destructible.prototype.isDestructed = function () {
            return this._isDestructed;
        };
        /**
         * Destruct this class.
         *
         * @public
         * @method destruct
         */
        Destructible.prototype.destruct = function () {
            this._isDestructed = true;
        };
        Destructible.eventNamespaceCount = 10000000;
        return Destructible;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Destructible;
});
