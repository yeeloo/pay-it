var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, AbstractTask_1) {
    var WaitForReadyTask = (function (_super) {
        __extends(WaitForReadyTask, _super);
        function WaitForReadyTask() {
            _super.apply(this, arguments);
        }
        WaitForReadyTask.prototype.ready = function () {
            this.isReady = true;
            if (this.isExecuting()) {
                this.done();
            }
        };
        WaitForReadyTask.prototype.executeTaskHook = function () {
            if (this.isReady) {
                this.done();
            }
        };
        return WaitForReadyTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WaitForReadyTask;
});
