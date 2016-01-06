var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/temple/events/CommonEvent", "../core/BranchIterator", "../events/BranchLoaderEvent", "../events/AssetEvent"], function (require, exports, EventDispatcher_1, CommonEvent_1, BranchIterator_1, BranchLoaderEvent_1, AssetEvent_1) {
    var BranchLoader = (function (_super) {
        __extends(BranchLoader, _super);
        function BranchLoader() {
            _super.call(this);
        }
        BranchLoader.prototype.loadBranch = function (branch) {
            this.percLoaded = this.eachPerc = this.loaded = this.total = this.loadedFiles = this.totalFiles = this.actualLoaded = this.actualTotal = 0;
            this.total = 0;
            this.totalFiles = BranchIterator_1.default.init(branch);
            this.actualTotal = this.getActualTotal(branch);
            this.totalFiles = BranchIterator_1.default.init(branch);
            this.current = -1;
            this.eachPerc = 1 / this.actualTotal;
            if (this.hasEventListener(BranchLoaderEvent_1.default.START)) {
                this.dispatchEvent(new BranchLoaderEvent_1.default(BranchLoaderEvent_1.default.START));
            }
            this.loadNext();
        };
        BranchLoader.prototype.getCurrentAsset = function () {
            return this._currentAsset;
        };
        BranchLoader.prototype.interrupt = function () {
            //this._currentAsset.abort();
            //this._currentAsset.destroy();
            this.total = this.loaded;
            this.totalFiles = this.loadedFiles;
            this.actualTotal = this.actualLoaded;
            this.dispatchComplete();
        };
        BranchLoader.prototype.loadNext = function () {
            this._currentAsset = BranchIterator_1.default.next();
            if (this._currentAsset && !this._currentAsset.active) {
                this._currentAsset._onProgressDelegate = this.onProgress.bind(this);
                this._currentAsset._onCompleteDelegate = this.onComplete.bind(this);
                this._currentAsset._onErrorDelegate = this.onError.bind(this);
                this._currentAsset.addEventListener(AssetEvent_1.default.ASSET_PROGRESS, this._currentAsset._onProgressDelegate);
                this._currentAsset.addEventListener(AssetEvent_1.default.ASSET_COMPLETE, this._currentAsset._onCompleteDelegate);
                this._currentAsset.addEventListener(AssetEvent_1.default.ASSET_ERROR, this._currentAsset._onErrorDelegate);
                this._currentAsset.init();
                this.dispatchEvent(new BranchLoaderEvent_1.default(BranchLoaderEvent_1.default.LOAD_PAGE, this._currentAsset));
            }
            else {
                this.next(true);
            }
        };
        BranchLoader.prototype.onProgress = function (event) {
            if (isNaN(event.perc)) {
                event.perc = 0;
            }
            this.percLoaded = Math.round(((this.actualLoaded * this.eachPerc) + (this.eachPerc * event.perc)) * 1000) / 1000;
            this.dispatchProgress();
        };
        BranchLoader.prototype.onComplete = function (event) {
            this.removeAssetListeners(event.asset);
            this.next();
        };
        BranchLoader.prototype.onError = function (event) {
            this.removeAssetListeners(this._currentAsset);
            this.next();
        };
        BranchLoader.prototype.next = function (skip) {
            if (skip === void 0) { skip = false; }
            ++this.loadedFiles;
            if (!skip) {
                ++this.actualLoaded;
            }
            if (this.loadedFiles < this.totalFiles) {
                this.percLoaded = Math.round(Math.min(1, (this.actualLoaded * this.eachPerc)) * 1000) / 1000;
                this.loadNext();
            }
            else {
                this.total = this.loaded;
                this.totalFiles = this.loadedFiles;
                this.actualTotal = this.actualLoaded;
                this.dispatchComplete();
            }
        };
        BranchLoader.prototype.dispatchProgress = function () {
            this.dispatchEvent(new AssetEvent_1.default(AssetEvent_1.default.ASSET_PROGRESS, this._currentAsset, this.actualLoaded - 1, this.actualTotal, this.percLoaded, false));
        };
        BranchLoader.prototype.dispatchComplete = function () {
            this.dispatchEvent(new CommonEvent_1.default(CommonEvent_1.default.COMPLETE));
        };
        BranchLoader.prototype.removeAssetListeners = function (asset) {
            asset.removeEventListener(AssetEvent_1.default.ASSET_PROGRESS, asset._onProgressDelegate);
            asset.removeEventListener(AssetEvent_1.default.ASSET_COMPLETE, asset._onCompleteDelegate);
            asset.removeEventListener(AssetEvent_1.default.ASSET_ERROR, asset._onErrorDelegate);
        };
        BranchLoader.prototype.getActualTotal = function (branch) {
            var count = 0;
            BranchIterator_1.default.init(branch);
            while (true) {
                var asset = BranchIterator_1.default.next();
                if (asset == null) {
                    break;
                }
                else if (!asset.active) {
                    count++;
                }
            }
            return count;
        };
        return BranchLoader;
    })(EventDispatcher_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BranchLoader;
});
