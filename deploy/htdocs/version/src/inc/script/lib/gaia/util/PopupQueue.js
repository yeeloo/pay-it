define(["require", "exports", 'lib/gaia/api/Gaia', 'lib/gaia/core/SiteController'], function (require, exports, Gaia, SiteController_1) {
    var PopupQueue = (function () {
        function PopupQueue() {
            var _this = this;
            this._queue = [];
            this.handleAfterComplete = function (event) {
                _this.tryGotoPopup();
            };
            Gaia.api.afterComplete(this.handleAfterComplete);
        }
        PopupQueue.prototype.add = function (popupId, deeplink) {
            this._queue.push({ popupId: popupId, deeplink: deeplink });
            this.tryGotoPopup();
        };
        PopupQueue.prototype.tryGotoPopup = function () {
            // Do we have a queue and are we currently not transitioning or loading?
            if (this._queue.length && !SiteController_1.default.isBusy()) {
                // Does our current page has this popup
                if (Gaia.api.getPage(Gaia.api.getCurrentBranch()).pages.hasOwnProperty(this._queue[0].popupId)) {
                    Gaia.api.gotoPopup(this._queue[0].popupId, this._queue.shift().deeplink);
                }
            }
        };
        return PopupQueue;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PopupQueue;
});
