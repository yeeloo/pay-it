define(["require", "exports"], function (require, exports) {
    var AbstractFlow = (function () {
        function AbstractFlow(flowManager) {
            this.flowManager = flowManager;
        }
        AbstractFlow.prototype.isDestructed = function () {
            return this.flowManager != null;
        };
        AbstractFlow.prototype.destruct = function () {
            this.flowManager = null;
        };
        return AbstractFlow;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractFlow;
});
