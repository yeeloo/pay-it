define(["require", "exports"], function (require, exports) {
    /**
     * AssetID is a enum use by the {{#crossLink "temple.net.ResourceManager"}}{{/crossLink}}
     * and is a reference to the {{#crossLink "app.config.config"}}{{/crossLink}} urls list
     *
     * @namespace app.config
     * @class AssetID
     */
    var AssetID;
    (function (AssetID) {
        AssetID[AssetID["BUG_IMG_PNG"] = 0] = "BUG_IMG_PNG";
    })(AssetID || (AssetID = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AssetID;
});
