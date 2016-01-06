var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractFlow", "./Flow"], function (require, exports, AbstractFlow_1, Flow_1) {
    /**
     * @class PreloadFlow
     */
    var PreloadFlow = (function (_super) {
        __extends(PreloadFlow, _super);
        function PreloadFlow() {
            _super.apply(this, arguments);
            this._flow = Flow_1.default.PRELOAD;
        }
        PreloadFlow.prototype.getFlow = function () {
            return this._flow;
        };
        /**
         * @public
         * @method start
         */
        PreloadFlow.prototype.start = function () {
            this.flowManager.transitionOut();
        };
        /**
         * @public
         * @method afterTransitionOutDone
         */
        PreloadFlow.prototype.afterTransitionOutDone = function () {
            this.flowManager.preload();
        };
        /**
         * @public
         * @method afterPreloadDone
         */
        PreloadFlow.prototype.afterPreloadDone = function () {
            this.flowManager.transition();
        };
        /**
         * @public
         * @method afterTransitionDone
         */
        PreloadFlow.prototype.afterTransitionDone = function () {
            this.flowManager.transitionIn();
        };
        /**
         * @public
         * @method afterTransitionInDone
         */
        PreloadFlow.prototype.afterTransitionInDone = function () {
            this.flowManager.complete();
        };
        return PreloadFlow;
    })(AbstractFlow_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PreloadFlow;
});
