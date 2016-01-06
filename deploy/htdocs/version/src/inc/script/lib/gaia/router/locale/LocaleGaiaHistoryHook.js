define(["require", "exports", "../../api/Gaia", "../../../temple/locale/LocaleManager", "../../events/GaiaHistoryEvent", "lib/temple/events/CommonEvent"], function (require, exports, Gaia, LocaleManager_1, GaiaHistoryEvent_1, CommonEvent_1) {
    /**
     * @module Temple
     * @namespace gaia.router.locale
     * @class LocaleGaiaHistoryHook
     */
    var LocaleGaiaHistoryHook = (function () {
        function LocaleGaiaHistoryHook() {
            var _this = this;
            Gaia.history.addEventListener(GaiaHistoryEvent_1.default.DEEPLINK, function () {
                //if (DEBUG) console.log('GHH > on GaiaHistory change: ', Gaia.router.getLocale());
                _this._internal = true;
                LocaleManager_1.default.getInstance().setLocale(Gaia.router.getLocale());
                _this._internal = false;
            });
            LocaleManager_1.default.getInstance().setLocale(Gaia.router.getLocale());
            LocaleManager_1.default.getInstance().addEventListener(CommonEvent_1.default.CHANGE, function () {
                if (!_this._internal) {
                    Gaia.router.setLocale(LocaleManager_1.default.getInstance().getLocale());
                }
            });
        }
        return LocaleGaiaHistoryHook;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LocaleGaiaHistoryHook;
});
