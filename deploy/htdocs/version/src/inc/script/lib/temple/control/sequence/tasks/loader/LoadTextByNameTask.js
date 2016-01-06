var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./LoadTextTask"], function (require, exports, LoadTextTask_1) {
    /**
     * Task for loading a file as a text
     */
    var LoadTextByNameTask = (function (_super) {
        __extends(LoadTextByNameTask, _super);
        /**
         * Creates a new instance of the LoadTextByNameTask
         *
         * @param configManager {ConfigManager} the ConfigManager instance which has the URL of the text file
         * @param name {string} the name of the URL of the text file in the ConfigManager
         * @param completeCallback {Function} a method which is called when the load of the text file is complete. The
         * content of the text file is passed as argument to the method
         */
        function LoadTextByNameTask(configManager, name, completeCallback) {
            if (completeCallback === void 0) { completeCallback = null; }
            _super.call(this, null, completeCallback);
            this._configManager = configManager;
            this.name = name;
        }
        LoadTextByNameTask.prototype.executeTaskHook = function () {
            this.url = this._configManager.getURL(this.name);
            _super.prototype.executeTaskHook.call(this);
        };
        /**
         * @inheritDoc
         */
        LoadTextByNameTask.prototype.destruct = function () {
            this.name = null;
            this._configManager = null;
            _super.prototype.destruct.call(this);
        };
        return LoadTextByNameTask;
    })(LoadTextTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LoadTextByNameTask;
});
