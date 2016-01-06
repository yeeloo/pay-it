var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/gaia/core/GaiaMain", "app/control/StartUp", "lib/gaia/api/Gaia", "app/data/DataManager", 'lib/temple/utils/Log'], function (require, exports, GaiaMain_1, StartUp_1, Gaia, DataManager_1, Log_1) {
    /**
     * Where it all start
     *
     * @namespace app
     * @class Main
     * @extend gaia.core.GaiaMain
     */
    var Main = (function (_super) {
        __extends(Main, _super);
        /**
         * @method constructor
         * @param {app.config.sitemap} sitemap
         */
        function Main(sitemap) {
            var _this = this;
            _super.call(this);
            this._log = new Log_1.default('app.Main');
            var startUp = new StartUp_1.default();
            startUp.execute(function () {
                _this._log.log('StartUp complete, starting Gaia...');
                _this.startGaia(sitemap);
            });
        }
        /**
         * @method onInit
         */
        Main.prototype.onInit = function () {
            _super.prototype.onInit.call(this);
            this._log.log('onInit');
            // enable for example below
            //this._beforeGotoHijack = Gaia.api.beforeGoto(<(event:GaiaEvent) => void>this.onBeforeGoto.bind(this), true);
        };
        /**
         * @method onBeforeGoto
         * @param {GaiaEvent} event
         */
        Main.prototype.onBeforeGoto = function (event) {
            // example implementation to disallow access to pages by checking certain things
            var dataManager = DataManager_1.default.getInstance();
            var pageData = Gaia.api.getPage(event.routeResult[0].branch).data || {};
            var isAuthenticated = true;
            // check if we are on a user page, but are not loggedin
            // this could happen when going to a deeplink or using the browsers back button
            if (pageData.hasOwnProperty('auth') && pageData.auth == true && isAuthenticated) {
                // not allowed, goto home
                Gaia.api.goto('/index');
            }
            else if (pageData.hasOwnProperty('ifAuthenticated') && isAuthenticated) {
                Gaia.api.goto(pageData.ifAuthenticated);
            }
            else {
                // allowed, just continue
                this._beforeGotoHijack();
            }
            //todo: add 'current' class to the current active page (leaf)
        };
        return Main;
    })(GaiaMain_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Main;
});
