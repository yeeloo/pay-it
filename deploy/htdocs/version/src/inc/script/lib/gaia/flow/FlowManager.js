define(["require", "exports", "./Flow", "./NormalFlow", "./CrossFlow", "./PreloadFlow"], function (require, exports, Flow_1, NormalFlow_1, CrossFlow_1, PreloadFlow_1) {
    /**
     * @module Gaia
     * @namespace gaia.flow
     * @class FlowManager
     */
    var FlowManager = (function () {
        function FlowManager(gaiaHQ, flow) {
            if (flow === void 0) { flow = Flow_1.default.NORMAL; }
            this._flow = null;
            this._flows = {};
            this._gaiaHQ = gaiaHQ;
            this.setFlow(flow);
        }
        FlowManager.prototype.getFlow = function () {
            return this._flow.getFlow();
        };
        FlowManager.prototype.setFlow = function (flow) {
            if (this._flows[flow]) {
                this._flow = this._flows[flow];
            }
            else {
                switch (flow) {
                    case Flow_1.default.NORMAL:
                        {
                            this._flow = new NormalFlow_1.default(this);
                            break;
                        }
                    case Flow_1.default.CROSS:
                        {
                            this._flow = new CrossFlow_1.default(this);
                            break;
                        }
                    case Flow_1.default.PRELOAD:
                        {
                            this._flow = new PreloadFlow_1.default(this);
                            break;
                        }
                    case null:
                        {
                            // keep current, do nothing
                            return;
                        }
                    default:
                        {
                            throw new Error("Unhandled flow: " + flow);
                        }
                }
                this._flows[flow] = this._flow;
            }
        };
        /**
         * from GaiaHQ to flow
         *
         * @public
         * @method afterGoto
         */
        FlowManager.prototype.afterGoto = function () {
            this._flow.start();
        };
        /**
         * @public
         * @method afterTransitionOutDone
         */
        FlowManager.prototype.afterTransitionOutDone = function () {
            this._flow.afterTransitionOutDone();
        };
        /**
         * @public
         * @method afterPreloadDone
         */
        FlowManager.prototype.afterPreloadDone = function () {
            this._flow.afterPreloadDone();
        };
        /**
         * @public
         * @method afterTransitionDone
         */
        FlowManager.prototype.afterTransitionDone = function () {
            this._flow.afterTransitionDone();
        };
        /**
         * @public
         * @method afterTransitionInDone
         */
        FlowManager.prototype.afterTransitionInDone = function () {
            this._flow.afterTransitionInDone();
        };
        // from flow
        // to GaiaHQ
        /**
         * @public
         * @method transitionOut
         */
        FlowManager.prototype.transitionOut = function () {
            this._gaiaHQ.beforeTransitionOut();
        };
        /**
         * @public
         * @method preload
         */
        FlowManager.prototype.preload = function () {
            this._gaiaHQ.beforePreload();
        };
        /**
         * @public
         * @method transition
         */
        FlowManager.prototype.transition = function () {
            this._gaiaHQ.beforeTransition();
        };
        /**
         * @public
         * @method transitionIn
         */
        FlowManager.prototype.transitionIn = function () {
            this._gaiaHQ.beforeTransitionIn();
        };
        /**
         * @public
         * @method complete
         */
        FlowManager.prototype.complete = function () {
            this._gaiaHQ.afterComplete();
        };
        // from SiteController
        // to GaiaHQ
        /**
         * @public
         * @method start
         */
        FlowManager.prototype.start = function (flow) {
            if (flow) {
                this.setFlow(flow);
            }
            this._gaiaHQ.afterGoto();
        };
        /**
         * @public
         * @method transitionOutComplete
         */
        FlowManager.prototype.transitionOutComplete = function () {
            this._gaiaHQ.afterTransitionOut();
        };
        /**
         * @public
         * @method preloadComplete
         */
        FlowManager.prototype.preloadComplete = function () {
            this._gaiaHQ.afterPreload();
        };
        /**
         * @public
         * @method transitionComplete
         */
        FlowManager.prototype.transitionComplete = function () {
            this._gaiaHQ.afterTransition();
        };
        /**
         * @public
         * @method transitionInComplete
         */
        FlowManager.prototype.transitionInComplete = function () {
            this._gaiaHQ.afterTransitionIn();
        };
        return FlowManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlowManager;
});
