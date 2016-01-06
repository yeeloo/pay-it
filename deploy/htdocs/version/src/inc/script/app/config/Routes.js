define(["require", "exports", "lib/temple/config/configManagerInstance", "lib/gaia/api/Gaia", "app/data/enum/Branches", "app/data/enum/Params"], function (require, exports, configManagerInstance_1, Gaia, Branches_1, Params_1) {
    /**
     * Set up your routes here. See lib.gaia.router.GaiaRouter
     * or http://www.devmonks.nl/m/mediamonks/frontend/gaia/docs/docs-sitemap-and-routing
     * for more info.
     *
     * @namespace app.config
     * @class Routes
     */
    var Routes = (function () {
        function Routes() {
        }
        /**
         * Set up the global config and all individual route configuration here
         *
         * You should remove _all_ routes here when starting a new project, except for the HOME route.
         *
         * @method init
         */
        Routes.init = function () {
            var UINT = '^\\d+$';
            // position or negative numbers without decimals
            var INT = '^-?\\d+$';
            // position or negative numbers with or without decimals
            var NUMBER = '^-?\\d+(\\.\\d+)?$';
            // Only '1' or '0'
            var BOOLEAN = '^1|0$';
            // used for slugs (e.g. foo-bar)
            var SLUG = '^\\w+$';
            // config setup
            Gaia.router.config()
                .assert(Params_1.default.ID, UINT)
                .setDefaultLocale(configManagerInstance_1.default.getProperty('defaultLocale'))
                .setLocaleRegExp(/^[\/]?(([a-z]{2}[_\-][A-Z]{2})|([a-z]{2}))(\/|$)/gi)
                .enable();
            // init the router, do stuff based on config
            Gaia.router.init();
            //
            // ROUTE CONFIGURATION
            //
            // default page
            Gaia.router.page('/', Branches_1.default.HOME);
            //
            // BELOW ARE EXAMPLES, REMOVE IN NEW PROJECT!
            //
            /*
            // route redirection
            //Gaia.router.redirect('/terms', '/info');
    
            Gaia.router.page('/knockout', Page.KNOCKOUT);
    //			.redirectOnLanding('/info');
    
            Gaia.router.page('/info', Page.INFO)
                .redirectOnLanding((routeResult:any, cb:(route:string) => void) =>
                {
                    setTimeout(() =>
                    {
                        cb('/contact');
                    }, 3000);
                }); // do a different landing check for this page
    
            Gaia.router.page('/contact', Page.INFO)
                .redirectOnLanding(null); // disable the landing check for this page (overwrite the default)
    
            Gaia.router.page('/about', Page.INFO);
    
            // param route with popup
            Gaia.router.page('/test1/:' + Param.ID + '/:' + Param.SLUG + '', Page.HOME + '/test1');
            // param route
            Gaia.router.page('/detail/:' + Param.ID + '/:' + Param.SLUG + '', Page.DETAIL);
    
            // param route with custom assertions
            Gaia.router.page('/video/:' + Param.ID + '/:' + Param.SLUG + '', Page.VIDEO)
                .assert(Param.ID, UINT)
                .assert(Param.SLUG, SLUG);
    
            // popup
            Gaia.router.page('/about', Page.HOME + '/' + Page.POPUP_ABOUT);
            // popup
            Gaia.router.page('/privacy', Page.HOME + '/' + Page.POPUP_PRIVACY);
    
            Gaia.router.page('/canvas', Page.CANVAS);
    
            // popup with deeplink
            Gaia.router.page('/video/:' + Param.ID + '/:' + Param.SLUG + '/about/:' + Param.ID + '', Page.VIDEO + '/' + Page.POPUP_ABOUT);
    
            */
        };
        return Routes;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Routes;
});
