define(["require", "exports", "./ConfigManager"], function (require, exports, ConfigManager_1) {
    var configManagerInstance = window['configManager'] = new ConfigManager_1.default();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = configManagerInstance;
});
