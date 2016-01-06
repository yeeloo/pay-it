var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, AbstractTask_1) {
    var AsyncMethodTask = (function (_super) {
        __extends(AsyncMethodTask, _super);
        /**
         * @param method the method that will be called when executing this task.
         */
        function AsyncMethodTask(_method) {
            _super.call(this);
            this._method = _method;
        }
        AsyncMethodTask.prototype.executeTaskHook = function () {
            if (this._method)
                this._method(this.done.bind(this), this.fail.bind(this));
        };
        /**
         * @inheritDoc
         */
        AsyncMethodTask.prototype.destruct = function () {
            this._method = null;
            _super.prototype.destruct.call(this);
        };
        return AsyncMethodTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AsyncMethodTask;
});
