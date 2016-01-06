var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractTask"], function (require, exports, AbstractTask_1) {
    var TimeDelayTask = (function (_super) {
        __extends(TimeDelayTask, _super);
        function TimeDelayTask(milliseconds) {
            _super.call(this);
            this.milliseconds = milliseconds;
        }
        TimeDelayTask.prototype.executeTaskHook = function () {
            this._timeout = setTimeout(this.done.bind(this), this.milliseconds);
        };
        TimeDelayTask.prototype.cancel = function () {
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            return true;
        };
        return TimeDelayTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeDelayTask;
});
