var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "../flow/Flow", "lib/gaia/assets/PageAsset"], function (require, exports, EventDispatcher_1, Flow_1, PageAsset_1) {
    var SiteModel = (function (_super) {
        __extends(SiteModel, _super);
        function SiteModel() {
            _super.call(this);
        }
        SiteModel.prototype.load = function (sitemap) {
            SiteModel._sitemap = sitemap;
            if (SiteModel._sitemap.config) {
                if (SiteModel._sitemap.config.controllerPath) {
                    PageAsset_1.default.controllerPath = SiteModel._sitemap.config.controllerPath;
                }
                if (SiteModel._sitemap.config.viewModelPath) {
                    PageAsset_1.default.viewModelPath = SiteModel._sitemap.config.viewModelPath;
                }
                if (SiteModel._sitemap.config.templatePath) {
                    PageAsset_1.default.templatePath = SiteModel._sitemap.config.templatePath;
                }
            }
            // Thijs hack: dispatch init event so you can do something with the xml before it is parsed
            //dispatchEvent(new Event(Event.INIT));
            this.parseSite();
            this.parseTree();
            //dispatchEvent(new Event(Event.COMPLETE));
        };
        SiteModel.getSitemap = function () {
            return SiteModel._sitemap;
        };
        SiteModel.getTree = function () {
            return SiteModel._tree;
        };
        SiteModel.getTitle = function () {
            return SiteModel._title;
        };
        SiteModel.getIndexFirst = function () {
            return SiteModel._indexFirst;
        };
        SiteModel.getIndexID = function () {
            return SiteModel._indexID;
        };
        SiteModel.getVersion = function () {
            return SiteModel._version.toString();
        };
        SiteModel.prototype.parseSite = function () {
            SiteModel._title = SiteModel._sitemap.title || "";
            SiteModel._history = !(SiteModel._sitemap.history == false);
            SiteModel._indexFirst = (SiteModel._sitemap.indexFirst == true);
            //SiteModel._assetPath = SiteModel._sitemap.assetPath || "";
            SiteModel._version = SiteModel._sitemap.version; // || FlashVars.getValue("version");
        };
        SiteModel.prototype.parsePopupPage = function (page, node) {
            if (page.pages) {
                for (var j = 0; j < page.pages.length; ++j) {
                    this.parsePopupPage(page.pages[j], node);
                }
            }
        };
        SiteModel.prototype.getPages = function (page) {
            var pages = [];
            if (page.pages) {
                for (var i = 0; i < page.pages.length; ++i) {
                    pages.push(page.pages[i]);
                    pages = pages.concat(this.getPages(page.pages[i]));
                }
            }
            return pages;
        };
        SiteModel.prototype.parseTree = function () {
            var node = SiteModel._sitemap.pages[0];
            if (node.id != undefined) {
                SiteModel._indexID = node.id;
            }
            var popupString = '[]';
            if (typeof SiteModel._sitemap.popups !== 'undefined') {
                for (var i = 0; i < SiteModel._sitemap.popups.length; i++) {
                    var popup = SiteModel._sitemap.popups[i];
                    popup.type = "popup";
                }
                popupString = JSON.stringify(SiteModel._sitemap.popups);
            }
            SiteModel._tree = this.parsePage(node, null, popupString);
        };
        SiteModel.prototype.parseChildren = function (parent, childNodes, popupString) {
            if (popupString === void 0) { popupString = null; }
            var children = {};
            var len = childNodes.length;
            for (var i = 0; i < len; i++) {
                var node = childNodes[i];
                var page = this.parsePage(node, parent, popupString);
                children[page.id] = page;
            }
            return children;
        };
        SiteModel.prototype.parsePage = function (node, parent, popupString) {
            if (parent === void 0) { parent = null; }
            if (popupString === void 0) { popupString = null; }
            SiteModel.validateNode(node, true);
            var isIndex = (node.id == SiteModel._indexID);
            // merge popups from this page
            if (node.popups) {
                for (var i = 0; i < node.popups.length; i++) {
                    var popup = node.popups[i];
                    popup.type = "popup";
                }
                popupString = JSON.stringify(JSON.parse(popupString).concat(node.popups));
            }
            if (!isIndex) {
                if (node.type == 'popup' || parent.type == 'popup') {
                    node.type = 'popup';
                }
            }
            // add popup pages to node
            if (node.type != "popup" && (node.landing || !node.pages || node.pages.length == 0)) {
                if (!node.pages) {
                    node.pages = [];
                }
                var copy = JSON.parse(popupString);
                for (var j = 0; j < copy.length; ++j) {
                    this.parsePopupPage(copy[j], node);
                }
                node.pages = node.pages.concat(copy);
                node.landing = true;
            }
            var page = new PageAsset_1.default(node);
            if (!isIndex) {
                page.setParent(parent);
            }
            page.data = node.data;
            page.type = node.type;
            if (node.type == 'popup') {
                page.type = 'popup';
            }
            // assets
            //		if (node.assets && node.assets.length > 0){
            //			page.assets = this.parseAssets(node.assets, page);
            //		}
            // child pages
            if (node.pages && node.pages.length > 0) {
                page.defaultChild = node.defaultChild;
                page.pages = this.parseChildren(page, node.pages, popupString);
                if (!page.pages[page.defaultChild]) {
                    page.defaultChild = node.pages[0].id;
                }
            }
            else {
                page.landing = true;
            }
            return page;
        };
        SiteModel.prototype.parseAssets = function (nodes, page) {
            var order = 0;
            var assets = {};
            // ------- TODO --------
            //var len: number = nodes.length;
            //for (var i: number = 0; i < len; i++) 
            //{
            //	var node: any = nodes[i];
            //	SiteModel.validateNode(node);
            //	assets[node.id] = AssetCreator.create(node, page);
            //	AbstractAsset(assets[node.id]).order = ++order;
            //}
            return assets;
        };
        // Site XML Validation
        SiteModel.validateNode = function (node, isPage) {
            if (isPage === void 0) { isPage = false; }
            var error = "*Invalid Site XML* " + (isPage ? "Page " : "Asset ");
            if (node.id == undefined) {
                throw new Error(error + "node missing required attribute 'id'");
            }
            //		else if (node.controller == undefined)
            //		{
            //			throw new Error(error + "node missing required attribute 'controller'");
            //		}
        };
        SiteModel.invalidBinding = function (value) {
            return ((value.indexOf("}") > -1 && value.indexOf("{") == -1) || (value.indexOf("{") > -1 && value.indexOf("}") == -1));
        };
        SiteModel.defaultFlow = Flow_1.default.NORMAL;
        return SiteModel;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SiteModel;
});
