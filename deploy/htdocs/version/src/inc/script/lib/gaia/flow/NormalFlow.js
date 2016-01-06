var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractFlow", "./Flow"], function (require, exports, AbstractFlow_1, Flow_1) {
    /**
     * @class NormalFlow
     */
    var NormalFlow = (function (_super) {
        __extends(NormalFlow, _super);
        function NormalFlow() {
            _super.apply(this, arguments);
            this._flow = Flow_1.default.NORMAL;
        }
        NormalFlow.prototype.getFlow = function () {
            return this._flow;
        };
        /**
         * @public
         * @method start
         */
        NormalFlow.prototype.start = function () {
            this.flowManager.preload();
        };
        /**
         * @public
         * @method afterPreloadDone
         */
        NormalFlow.prototype.afterPreloadDone = function () {
            this.flowManager.transitionOut();
        };
        /**
         * @public
         * @method afterTransitionOutDone
         */
        NormalFlow.prototype.afterTransitionOutDone = function () {
            this.flowManager.transition();
        };
        /**
         * @public
         * @method afterTransitionDone
         */
        NormalFlow.prototype.afterTransitionDone = function () {
            this.flowManager.transitionIn();
        };
        /**
         * @public
         * @method afterTransitionInDone
         */
        NormalFlow.prototype.afterTransitionInDone = function () {
            this.flowManager.complete();
        };
        return NormalFlow;
    })(AbstractFlow_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NormalFlow;
});
