var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "lib/temple/events/EventDispatcher", "lib/temple/config/configManagerInstance", "app/config/AssetID", "lib/temple/events/BaseEvent", "../events/DataEvent", "../utils/Log"], function (require, exports, EventDispatcher_1, configManagerInstance_1, AssetID_1, BaseEvent_1, DataEvent_1, Log_1) {
    /**
     * ResourceManager
     *
     * @module Temple
     * @namespace temple.net
     * @class ResourceManager
     * @author Mient-jan Stelling
     */
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager() {
            var _this = this;
            _super.call(this);
            this._assets = {};
            if (ResourceManager._instance) {
                throw new Error('ResourceManager is a singleton. use getInstance();');
            }
            if (typeof createjs != 'undefined'
                && typeof createjs.Sound != 'undefined') {
                createjs.Sound.addEventListener("fileload", function (event) { return _this.handleFileLoad(event); });
            }
        }
        /**
         * creates and returns a new HTMLImageElement
         *
         * @static
         * @method getImageElement
         * @param {string} src
         * @param {function} callback
         * @returns HTMLImageElement
         */
        ResourceManager.getImageElement = function (src, callback) {
            if (DEBUG && typeof (src) != 'string') {
                debugger;
            }
            var img = document.createElement('img');
            img.onload = function (ev) {
                callback.call(null, this);
            };
            img.src = src;
            return img;
        };
        /**
         * Creates and returns a HTMLImageElement
         *
         * @static
         * @method getImageElementByID
         * @param string id ConfigManager var identifier
         * @param Function callback Called when image is loaded.
         * @returns {HTMLImageElement}
         */
        ResourceManager.getImageElementByID = function (id, callback) {
            return ResourceManager.getImageElement(ResourceManager.cm.getURL(AssetID_1.default[id]), callback);
        };
        /**
         * @static
         * @method getManifest
         * @param list
         * @returns {IManifest[]}
         */
        ResourceManager.getManifestByAssetIDList = function (list) {
            var cm = configManagerInstance_1.default;
            var manifest = [];
            for (var i = 0; i < list.length; i++) {
                var src = cm.getURL(AssetID_1.default[list[i]]);
                manifest.push({
                    id: ResourceManager.hashCode(src),
                    src: src
                });
            }
            return manifest;
        };
        /**
         * @static
         * @method getManifest
         * @param list
         * @returns {IManifest[]}
         */
        ResourceManager.getManifestBySrcList = function (list) {
            var manifest = [];
            for (var i = 0; i < list.length; i++) {
                var src = list[i];
                manifest.push({
                    id: ResourceManager.hashCode(src),
                    src: src
                });
            }
            return manifest;
        };
        /**
         * Convert string to (h\d+)
         * @param str
         * @returns {*}
         */
        ResourceManager.hashCode = function (str) {
            var hash = 0, i, chr, len;
            if (str.length == 0) {
                return 'h' + hash;
            }
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return 'h' + hash;
        };
        /**
         * @static
         * @method getInstance
         * @returns {ResourceManager}
         */
        ResourceManager.getInstance = function () {
            if (!ResourceManager._instance) {
                ResourceManager._instance = new ResourceManager();
            }
            return ResourceManager._instance;
        };
        /**
         * @method load
         * @param {any[]} list
         * @return void
         */
        ResourceManager.prototype.load = function (assetList, onProcess, onComplete) {
            var _this = this;
            if (onProcess === void 0) { onProcess = null; }
            if (onComplete === void 0) { onComplete = null; }
            if (typeof createjs == 'undefined' && typeof createjs.LoadQueue == 'undefined') {
                throw new Error('can not us resource manager, createjs.LoadQueue is not loaded.');
            }
            var type = typeof assetList[0];
            var manifest;
            switch (type) {
                case 'number':
                    {
                        manifest = ResourceManager.getManifestByAssetIDList(assetList);
                        break;
                    }
                case 'string':
                    {
                        manifest = ResourceManager.getManifestBySrcList(assetList);
                        break;
                    }
            }
            for (var i = 0; i < manifest.length; i++) {
                if (this._assets[manifest[i].id]) {
                    manifest.splice(i, 1);
                }
            }
            var loader = new createjs.LoadQueue(false);
            if (typeof createjs != 'undefined' && typeof createjs.Sound != 'undefined') {
                loader.installPlugin(createjs.Sound);
            }
            loader.addEventListener("error", function (event) { return _this.handleLoadError(event); });
            loader.addEventListener("progress", function (event) {
                if (onProcess) {
                    onProcess(event);
                }
                _this.handleProgress(event);
            });
            loader.addEventListener("fileload", function (event) { return _this.handleFileLoad(event); });
            loader.addEventListener("complete", function (event) {
                if (onComplete) {
                    onComplete(event);
                }
                _this.handleComplete(event);
            });
            loader.loadManifest(manifest);
        };
        /**
         * Load images in async
         *
         * @method loadImagesAsync
         * @param assetList
         * @param onProgress Gives the progress of how many images are loaded. Will not give back 100 when a image is not
         *          able to load for example when the src of image is incorrect.
         * @param list
         * @returns {[id:string]:HTMLImageElement}
         */
        ResourceManager.prototype.loadImagesAsync = function (assetList, onProgress, list) {
            if (onProgress === void 0) { onProgress = null; }
            if (list === void 0) { list = {}; }
            var type = typeof assetList[0];
            var manifest;
            switch (type) {
                case 'number':
                    {
                        manifest = ResourceManager.getManifestByAssetIDList(assetList);
                        break;
                    }
                case 'string':
                    {
                        manifest = ResourceManager.getManifestBySrcList(assetList);
                        break;
                    }
            }
            var assets = 0;
            if (onProgress) {
                var loaded = 0;
                var onLoad = function () {
                    loaded++;
                    onProgress(loaded / assets * 100);
                };
            }
            for (var i = 0; i < manifest.length; i++) {
                if (!ResourceManager.isImageRegExp.test(manifest[i].src)) {
                    throw "loadasynch only has support for images " + manifest[i].id + " does not contain a image resource.";
                }
                if (!this._assets[manifest[i].id]) {
                    assets++;
                    this._assets[manifest[i].id] = ResourceManager.getImageElement(manifest[i].src, onLoad);
                }
                else {
                }
                list[manifest[i].id] = this._assets[manifest[i].id];
            }
            if (assets == loaded) {
                assets++;
                onLoad();
            }
        };
        ResourceManager.prototype.handleLoadError = function (event) {
            Log_1.default.error('Temple.Net.ResourceManager', "Error loading", event);
        };
        ResourceManager.prototype.handleFileLoad = function (event) {
            this._assets[ResourceManager.hashCode(event.item.src)] = event.result;
        };
        ResourceManager.prototype.handleComplete = function (event) {
            this.dispatchEvent(new BaseEvent_1.default('complete'));
        };
        ResourceManager.prototype.handleProgress = function (event) {
            this.dispatchEvent(new DataEvent_1.default('progress', event));
        };
        /**
         * Returns
         *
         * @method getByID
         * @param id
         * @returns {*}
         */
        ResourceManager.prototype.getByID = function (id) {
            var src = configManagerInstance_1.default.getURL(id);
            if (this._assets[ResourceManager.hashCode(src)] == void 0) {
                if (ResourceManager.isImageRegExp.test(src)) {
                    this._assets[src] = ResourceManager.getImageElement(src);
                }
            }
            return this._assets[src];
        };
        /**
         * Returns
         *
         * @method getByID
         * @param id
         * @returns {*}
         */
        ResourceManager.prototype.getByAssetID = function (id) {
            return this.getByID(AssetID_1.default[id]);
        };
        /**
         * Returns
         *
         * @method getByID
         * @param id
         * @returns {*}
         */
        ResourceManager.prototype.getByImageByAssetID = function (id, onLoad) {
            var strId = AssetID_1.default[id];
            var src = configManagerInstance_1.default.getURL(strId);
            return this.getByImageBySrc(src, onLoad);
        };
        ResourceManager.prototype.getByImageBySrc = function (src, onLoad) {
            var _this = this;
            var hashCode = ResourceManager.hashCode(src);
            var eventId = ResourceManager.EVENT_ONLOAD_IMAGE + '.' + hashCode;
            if (this._assets[hashCode] == void 0) {
                this.addEventListener(eventId, onLoad, null, true);
                this._assets[hashCode] = ResourceManager.getImageElement(src, function (img) { return _this.dispatchEvent(new DataEvent_1.default(eventId, img)); });
            }
            else {
                var asset = this._assets[hashCode];
                var hasContent = !!(asset && (asset.complete || asset['getContext'] || asset.readyState >= 2));
                if (!hasContent) {
                    this.addEventListener(eventId, onLoad, null, true);
                }
                else {
                    onLoad.call(null, new DataEvent_1.default(eventId, asset));
                }
            }
            return this._assets[hashCode];
        };
        ResourceManager.EVENT_ONLOAD_IMAGE = 'onload_image';
        ResourceManager.cm = configManagerInstance_1.default;
        /**
         * RegularExpression for checking if a string contains a image path (jpg, png only).
         *
         * @todo make a faster regex with less overhead.
         * @static
         * @property isImageRegExp
         * @type RegEx
         */
        ResourceManager.isImageRegExp = /[\w\/]+.jpg|[\w\/]+.png$/;
        /**
         * RegularExpression for checking if a string contains a audio path (mp3, ogg only).
         *
         * @todo make a faster regex with less overhead.
         * @static
         * @property isAudioRegExp
         * @type RegEx
         */
        ResourceManager.isAudioRegExp = /\.mp3$|\.ogg$/;
        return ResourceManager;
    })(EventDispatcher_1.default);
    return ResourceManager;
});
