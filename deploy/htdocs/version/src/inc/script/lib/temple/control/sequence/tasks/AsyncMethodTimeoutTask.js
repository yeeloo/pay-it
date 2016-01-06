var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AsyncMethodTask"], function (require, exports, AsyncMethodTask_1) {
    var AsyncMethodTimeoutTask = (function (_super) {
        __extends(AsyncMethodTimeoutTask, _super);
        /**
         * @param method the method that will be called when executing this task.
         */
        function AsyncMethodTimeoutTask(method, _time) {
            if (_time === void 0) { _time = 5000; }
            _super.call(this, method);
            this._time = _time;
        }
        AsyncMethodTimeoutTask.prototype.executeTaskHook = function () {
            this._timeout = setTimeout(this.done.bind(this), this._time);
            _super.prototype.executeTaskHook.call(this);
        };
        /**
         * @inheritDoc
         */
        AsyncMethodTimeoutTask.prototype.destruct = function () {
            clearTimeout(this._timeout);
            _super.prototype.destruct.call(this);
        };
        return AsyncMethodTimeoutTask;
    })(AsyncMethodTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AsyncMethodTimeoutTask;
});
