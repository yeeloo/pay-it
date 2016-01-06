var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask"], function (require, exports, AbstractTask_1) {
    /**
     * Task for loading a file as a text
     */
    var LoadTextTask = (function (_super) {
        __extends(LoadTextTask, _super);
        /**
         * Creates a new instance of the LoadTextTask
         *
         * @param url {string} the url to the text file
         * @param completeCallback a method which is called when the load of the text file is complete. The content of the
         * text file is passed as argument to the method
         */
        function LoadTextTask(url, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            _super.call(this);
            this.url = url;
            this._completeCallback = completeCallback;
        }
        LoadTextTask.prototype.executeTaskHook = function () {
            var _this = this;
            $.get(this.url)
                .done(function (data) {
                if (_this._completeCallback) {
                    _this._completeCallback(data);
                }
                _this.done();
            })
                .fail(function () {
                _this.fail('error getting text');
            });
        };
        /**
         * @inheritDoc
         */
        LoadTextTask.prototype.destruct = function () {
            this.url = null;
            this._completeCallback = null;
            _super.prototype.destruct.call(this);
        };
        return LoadTextTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LoadTextTask;
});
