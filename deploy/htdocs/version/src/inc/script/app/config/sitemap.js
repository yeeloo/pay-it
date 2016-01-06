define(["require", "exports"], function (require, exports) {
    /**
     * Minimal config:
     *
     *      {
     *          "id": "page-id"
     *      }
     *
     * Maximal config:**
     *
     *      {
     *          "id": "page-id",
     *          "title": "Page Title",
     *          "landing": true, // don't navigate to the first sub-page automatically, but stay on this specific page
     *          "controller": "app/page/custom/Controller", // custom controller location
     *          "viewModel": "app/page/custom/ViewModel", // custom viewmodel location
     *          "template": "custom-template.html", // custom template location
     *          "folder": "parent/", // this will put all page related files in a folder "parent" (convenient for nested views), a trailing slash is mandatory.
     *          "data" {
     *              "custom-data-property": "custom value", // use from PageAsset.prototype.getData('custom-data-property')
     *          },
     *          "container": "custom-data-gaia-container", // custom targeted container where to add this page
     *          "pages: [ // sub pages for this page
     *              {
     *                  // sub page
     *              }
     *          ],
     *          "popups": [ // popups for this page
     *              {
     *                  // sub page
     *                  {
     *                      "id": "popup-page-id"
     *                      "type": "popup", // to specify this page is a popup
     *                  }
     *              }
     *          ],
     *          "partials": {
     *              "app": [
     *                  "partials/partial-name.html" // relative from the template folder
     *              ],
     *              "mobile" [
     *                  "partials/partial-mobile.html" // relative from the template/mobile folder
     *                  "../partials/partial-name.html" // relative from the template/mobile folder, reusing the desktop version
     *              ]
     *          }
     *      }
     *
     * @documentation ../../doc/app/config/sitemap.md
     * @module Gaia
     * @namespace app.config
     * @class sitemap
     */
    /**
     * The title attribute is used to set the page's title. The {page} variable is replaced by the "title" attribute from the active page, so when you are
     * on the home-page title will say Gaia - Home.
     * @attribute title
     */
    /**
     * The config section is used for setting paths to the files that are loaded by Gaia. You normally won't touch these, but if you are doing some funky stuff you can change them here.
     * @attribute config
     */
    /**
     *
     * When navigationg to pages you should use the path to the page you want to navigate to including all the parent pages, like Gaia.api.goto('/index/navigation/home');.
     * For more information about navigating see the reference for Gaia.api.goto
     *
     * @attribute pages
     *
     */
    var sitemap = {
        "title": "Pay it",
        "config": {
            "controllerPath": "app/page/",
            "viewModelPath": "app/page/",
            "templatePath": "app/../../template/"
        },
        "pages": [
            {
                "id": "index",
                "pages": [
                    {
                        "id": "home",
                        "title": "Home"
                    }
                ]
            }
        ]
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = sitemap;
});
