var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/control/sequence/tasks/AbstractTask", "lib/temple/config/configManagerInstance", "lib/temple/locale/LocaleManager", "lib/temple/locale/LocaleKnockoutBinding", "lib/gaia/router/locale/LocaleGaiaHistoryHook", 'lib/temple/utils/Log'], function (require, exports, AbstractTask_1, configManagerInstance_1, LocaleManager_1, LocaleKnockoutBinding_1, LocaleGaiaHistoryHook_1, Log_1) {
    /*
     * Choose your provider
     */
    //import JSONLocaleProvider from "lib/temple/locale/provider/JSONLocaleProvider";
    //import JSONPLocaleProvider from "lib/temple/locale/provider/JSONPLocaleProvider";
    //import XMLLocaleProvider from "lib/temple/locale/provider/XMLLocaleProvider";
    //import XMLPLocaleProvider from "lib/temple/locale/provider/XMLPLocaleProvider";
    /**
     * @namespace app.control
     * @class InitLocaleTask
     * @extend temple.control.sequence.tasks.AbstractTask
     */
    var InitLocaleTask = (function (_super) {
        __extends(InitLocaleTask, _super);
        /**
         * @class InitLocaleTask
         * @constructor InitLocaleTask
         * @param {string} fallbackLocale
         */
        function InitLocaleTask(fallbackLocale) {
            if (fallbackLocale === void 0) { fallbackLocale = 'debug'; }
            _super.call(this);
            this._log = new Log_1.default('app.control.InitLocaleTask');
            this._fallbackLocale = fallbackLocale;
        }
        /**
         * @inheritDoc
         */
        InitLocaleTask.prototype.executeTaskHook = function () {
            this._log.log('executeTaskHook');
            // localization
            new LocaleKnockoutBinding_1.default();
            LocaleManager_1.default.getInstance().setFallbackLocale(this._fallbackLocale);
            // optional, add aliases for mapping http://yourwebsite/nl to http://yourwebsite/nl_NL
            LocaleManager_1.default.getInstance().addAlias('nl', 'nl_NL');
            // choose your poison!
            //var jsonProvider= new JSONLocaleProvider(LocaleManager.getInstance());
            //jsonProvider.addLocaleFile('en_GB', 'data/locale/en_GB.json', true);
            //jsonProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.json', true);
            //var xmlProvider = new XMLPLocaleProvider(LocaleManager.getInstance());
            //xmlProvider.addLocaleFile('en_GB', 'data/locale/en_GB.xmlp', true);
            //xmlProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.xmlp', true);
            // this will add the mapping between the url and the localeManager, and sets the LocaleManager to the current or default locale
            new LocaleGaiaHistoryHook_1.default();
            configManagerInstance_1.default.setVariable('locale', LocaleManager_1.default.getInstance().getLocale());
            this.done();
        };
        /**
         * @inheritDoc
         */
        InitLocaleTask.prototype.destruct = function () {
            this._fallbackLocale = null;
            _super.prototype.destruct.call(this);
        };
        return InitLocaleTask;
    })(AbstractTask_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InitLocaleTask;
});
