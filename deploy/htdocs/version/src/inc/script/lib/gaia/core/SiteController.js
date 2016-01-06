var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../core/GaiaHQ", "../core/BranchTools", "../core/BranchLoader", "../core/BranchManager", "../core/SiteModel", "../core/TransitionController", "../events/PageEvent", "../events/BranchLoaderEvent", "lib/temple/events/EventDispatcher", "lib/temple/events/CommonEvent"], function (require, exports, GaiaHQ_1, BranchTools_1, BranchLoader_1, BranchManager_1, SiteModel_1, TransitionController_1, PageEvent_1, BranchLoaderEvent_1, EventDispatcher_1, CommonEvent_1) {
    /**
     * @module Gaia
     * @namespace gaia.core
     * @class BranchManager
     * @extends temple.events.EventDispatcher
     */
    var SiteController = (function (_super) {
        __extends(SiteController, _super);
        function SiteController(sv) {
            _super.call(this);
            this.transitionController = new TransitionController_1.default();
            this.branchLoader = new BranchLoader_1.default();
            this.queuedFlow = null;
            this.siteView = sv;
            //preloadController = new PreloadController(null, preloader);
            //preloadController.addEventListener(PreloadController.READY, onPreloaderReady, false, 1);
            //preloadController.addEventListener(Event.COMPLETE, onPreloadComplete);
            this.branchLoader.addEventListener(BranchLoaderEvent_1.default.LOAD_PAGE, this.onLoadPage);
            this.branchLoader.addEventListener(BranchLoaderEvent_1.default.LOAD_ASSET, this.onLoadAsset);
            //this.branchLoader.addEventListener(BranchLoaderEvent.START, this.preloadController.onStart);
            //this.branchLoader.addEventListener(AssetEvent.ASSET_PROGRESS, preloadController.onProgress);
            //this.branchLoader.addEventListener(Event.COMPLETE, preloadController.onComplete);
            this.branchLoader.addEventListener(CommonEvent_1.default.COMPLETE, this.onPreloadComplete.bind(this));
            this.transitionController.addEventListener(PageEvent_1.default.TRANSITION_OUT_COMPLETE, this.onTransitionOutComplete);
            this.transitionController.addEventListener(PageEvent_1.default.TRANSITION_IN_COMPLETE, this.onTransitionInComplete);
            this.transitionController.addEventListener(PageEvent_1.default.TRANSITION_COMPLETE, this.onTransitionComplete);
            this.transitionController.addEventListener(PageEvent_1.default.BEFORE_INIT, this.dispatchEvent.bind(this));
        }
        SiteController.getCurrentBranch = function () {
            return SiteController.currentBranch;
        };
        SiteController.getCurrentRoute = function () {
            return SiteController.currentRoute;
        };
        //public static getPreloader():PreloadController
        //{
        //	return preloadController;
        //}
        SiteController.isBusy = function () {
            return SiteController.isTransitioning || SiteController.isLoading;
        };
        // GAIAHQ RECEIVER
        SiteController.prototype.onGoto = function (event) {
            BranchManager_1.default.cleanup();
            var validBranch = event.routeResult[0].branch;
            if (!event.external) {
                if (validBranch != SiteController.currentBranch) {
                    if (!SiteController.isTransitioning && !SiteController.isLoading) {
                        this.queuedBranch = null;
                        this.queuedFlow = null;
                        var flow;
                        if (event.flow == null) {
                            flow = SiteModel_1.default.defaultFlow;
                            if (!SiteModel_1.default.getTree().active && SiteModel_1.default.getIndexFirst()) {
                                // first just load the index
                                SiteController.currentBranch = SiteModel_1.default.getIndexID();
                            }
                            else {
                                // need to get the branch root page that will transition in to determine flow
                                var prevArray = BranchTools_1.default.getPagesOfBranch(SiteController.currentBranch);
                                var newArray = BranchTools_1.default.getPagesOfBranch(validBranch);
                                var i;
                                for (i = 0; i < newArray.length; i++) {
                                    if (newArray[i] != prevArray[i]) {
                                        break;
                                    }
                                }
                                if (newArray[i] == null || newArray[i] == undefined) {
                                }
                                else {
                                }
                                SiteController.currentBranch = validBranch;
                            }
                        }
                        else {
                            flow = event.flow;
                            SiteController.currentBranch = validBranch;
                        }
                        GaiaHQ_1.default.getInstance().flowManager.start(flow);
                    }
                    else {
                        this.queuedBranch = event.routeResult;
                        this.queuedFlow = event.flow;
                        if (!SiteController.isLoading) {
                            this.transitionController.interrupt();
                        }
                        else {
                            this.branchLoader.interrupt();
                        }
                    }
                }
            }
            else {
            }
        };
        // BRANCH LOADER EVENT LISTENERS
        SiteController.prototype.onLoadPage = function (event) {
            SiteController.isLoading = true;
            var page = event.asset;
            BranchManager_1.default.addPage(page);
            //siteView.addPage(page);
            page.preload();
        };
        SiteController.prototype.onLoadAsset = function (event) {
            SiteController.isLoading = true;
            //if (event.asset is DisplayObjectAsset) siteView.addAsset(event.asset as DisplayObjectAsset);
            //if (event.asset.preloadAsset) event.asset.preload();
        };
        // GAIAHQ EVENT LISTENERS
        SiteController.prototype.onTransitionOut = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isTransitioning = true;
                this.transitionController.transitionOut(BranchManager_1.default.getTransitionOutArray(SiteController.currentBranch));
            }
        };
        SiteController.prototype.onTransitionIn = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isTransitioning = true;
                this.transitionController.transitionIn(BranchTools_1.default.getPagesOfBranch(SiteController.currentBranch));
            }
        };
        SiteController.prototype.onTransition = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isTransitioning = true;
                this.transitionController.transition(BranchManager_1.default.getTransitionOutArray(SiteController.currentBranch), BranchTools_1.default.getPagesOfBranch(SiteController.currentBranch));
            }
        };
        SiteController.prototype.onPreload = function (event) {
            if (!this.checkQueuedBranch()) {
                SiteController.isLoading = true;
                this.branchLoader.loadBranch(SiteController.currentBranch);
            }
        };
        SiteController.prototype.onComplete = function (event) {
            this.checkQueuedBranch();
        };
        SiteController.prototype.onPreloadComplete = function (event) {
            SiteController.isLoading = false;
            GaiaHQ_1.default.getInstance().flowManager.preloadComplete();
            //this.siteView.preloader.addEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
        };
        // TRANSITION CONTROLLER EVENT LISTENERS
        SiteController.prototype.onTransitionOutComplete = function (event) {
            BranchManager_1.default.cleanup();
            GaiaHQ_1.default.getInstance().flowManager.transitionOutComplete();
        };
        SiteController.prototype.onTransitionInComplete = function (event) {
            BranchManager_1.default.cleanup();
            GaiaHQ_1.default.getInstance().flowManager.transitionInComplete();
        };
        SiteController.prototype.onTransitionComplete = function (event) {
            BranchManager_1.default.cleanup();
            GaiaHQ_1.default.getInstance().flowManager.transitionComplete();
        };
        // UTILITY FUNCTIONS
        SiteController.prototype.checkQueuedBranch = function () {
            SiteController.isLoading = SiteController.isTransitioning = false;
            if (this.queuedBranch) {
                this.redirect();
                return true;
            }
            return false;
        };
        SiteController.prototype.redirect = function () {
            // Waiting one frame makes this more stable when spamming goto events
            //this.siteView.addEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
            GaiaHQ_1.default.getInstance().goto(this.queuedBranch, this.queuedFlow);
        };
        SiteController.prototype.onPreloaderReady = function (event) {
            //this.preloadController.removeEventListener(Event.COMPLETE, onPreloaderReady);
            //if (this.PreloadController(event.target).asset) this.siteView.preloader.addChild(PreloadController(event.target).asset.loader);
            ////siteView.preloader.addChild(DisplayObject(preloadController.clip));
        };
        // EnterFrame functions
        SiteController.prototype.preloaderEnterFrame = function (event) {
            GaiaHQ_1.default.getInstance().flowManager.preloadComplete();
            //this.siteView.preloader.removeEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
        };
        SiteController.prototype.siteViewEnterFrame = function (event) {
            GaiaHQ_1.default.getInstance().goto(this.queuedBranch, this.queuedFlow);
            //this.siteView.removeEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
        };
        //private static preloadController:PreloadController;
        SiteController.currentBranch = "";
        SiteController.currentRoute = "";
        SiteController.isTransitioning = false;
        SiteController.isLoading = false;
        return SiteController;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SiteController;
});
