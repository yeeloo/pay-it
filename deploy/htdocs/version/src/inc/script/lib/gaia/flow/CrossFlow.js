var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractFlow", "./Flow"], function (require, exports, AbstractFlow_1, Flow_1) {
    /**
     * @class CrossFlow
     */
    var CrossFlow = (function (_super) {
        __extends(CrossFlow, _super);
        function CrossFlow() {
            _super.apply(this, arguments);
            this._isInDone = false;
            this._isOutDone = false;
            this._flow = Flow_1.default.CROSS;
        }
        CrossFlow.prototype.getFlow = function () {
            return this._flow;
        };
        /**
         * @public
         * @method start
         */
        CrossFlow.prototype.start = function () {
            this._isInDone = this._isOutDone = false;
            this.flowManager.preload();
        };
        /**
         * @public
         * @method afterPreloadDone
         */
        CrossFlow.prototype.afterPreloadDone = function () {
            this.flowManager.transition();
            this.flowManager.transitionOut();
            this.flowManager.transitionIn();
        };
        /**
         * @public
         * @method afterTransitionDone
         */
        CrossFlow.prototype.afterTransitionDone = function () {
        };
        /**
         * @public
         * @method afterTransitionInDone
         */
        CrossFlow.prototype.afterTransitionInDone = function () {
            this._isInDone = true;
            this.checkBothDone();
        };
        /**
         * @public
         * @method afterTransitionOutDone
         */
        CrossFlow.prototype.afterTransitionOutDone = function () {
            this._isOutDone = true;
            this.checkBothDone();
        };
        /**
         * @public
         * @method checkBothDone
         */
        CrossFlow.prototype.checkBothDone = function () {
            if (this._isInDone && this._isOutDone) {
                this._isInDone = this._isOutDone = false;
                this.flowManager.complete();
            }
        };
        return CrossFlow;
    })(AbstractFlow_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CrossFlow;
});
