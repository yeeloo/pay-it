var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./LoadJSONTask"], function (require, exports, LoadJSONTask_1) {
    var LoadJSONByNameTask = (function (_super) {
        __extends(LoadJSONByNameTask, _super);
        /**
         * @param name {string}
         * @param completeCallback {Function}
         * @param jsonpCallback {string}
         */
        function LoadJSONByNameTask(configManager, name, completeCallback, jsonpCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            if (jsonpCallback === void 0) { jsonpCallback = null; }
            _super.call(this, null, completeCallback, jsonpCallback);
            this._configManager = configManager;
            this._name = name;
        }
        LoadJSONByNameTask.prototype.executeTaskHook = function () {
            this._url = this._configManager.getURL(this._name);
            _super.prototype.executeTaskHook.call(this);
        };
        /**
         * @inheritDoc
         */
        LoadJSONByNameTask.prototype.destruct = function () {
            this._name = null;
            this._configManager = null;
            _super.prototype.destruct.call(this);
        };
        return LoadJSONByNameTask;
    })(LoadJSONTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LoadJSONByNameTask;
});
