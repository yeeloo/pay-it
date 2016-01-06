var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractElementManager", "./data/EaselTextData"], function (require, exports, AbstractElementManager_1, EaselTextData_1) {
    /**
     * @module Temple
     * @namespace temple.locale.element
     * @extend temple.locale.element.AbstractElementManager
     * @class EaselTextManager
     */
    var EaselTextManager = (function (_super) {
        __extends(EaselTextManager, _super);
        function EaselTextManager() {
            _super.call(this);
        }
        /**
         * @public
         * @static
         * @method getInstance
         * @returns {EaselTextManager}
         */
        EaselTextManager.getInstance = function () {
            if (typeof EaselTextManager._instance === 'undefined') {
                EaselTextManager._instance = new EaselTextManager();
            }
            return EaselTextManager._instance;
        };
        /**
         * @public
         * @method add
         * @param {createjs.Text} element
         * @param {string} id
         * @param {string} key
         */
        EaselTextManager.prototype.add = function (element, id, key) {
            _super.prototype.addElement.call(this, new EaselTextData_1.default(element, id, key));
        };
        /**
         * @public
         * @method updateElement
         * @param {EaselTextData} data
         */
        EaselTextManager.prototype.updateElement = function (data) {
            var text = this._localeManager.getString(data.id);
            this.setText(data, text);
        };
        /**
         * @public
         * @method getDataForElement
         * @param {createjs.Text} element
         * @returns {EaselTextData}
         */
        EaselTextManager.prototype.getDataForElement = function (element) {
            for (var i = 0; i < this._elements.length; i++) {
                if (this._elements[i].element == element) {
                    return this._elements[i];
                }
            }
            return null;
        };
        /**
         * @public
         * @method replaceIdByKey
         * @param {string} key
         * @param {string} id
         * @returns {boolean}
         */
        EaselTextManager.prototype.replaceIdByKey = function (key, id) {
            var success = false;
            for (var i = 0; i < this._elements.length; i++) {
                if (this._elements[i].key == key) {
                    this._elements[i].id = id;
                    if (this._localeManager.isReady()) {
                        this.updateElement(this._elements[i]);
                    }
                    success = true;
                }
            }
            return success;
        };
        /**
         * @todo This still needs a lot of work, there are major issues with the fact that we do not know how every specific
         *  browser positions canvas text. There should be a matrix that caches and corrects the inconsistencies of every
         *  browser. And a adjusts it accordingly.
         *
         * @public
         * @method setText
         * @param {EaselTextData} data
         * @param {string} text
         */
        EaselTextManager.prototype.setText = function (data, text) {
            data.element.text = text;
            //		var element = <createjs.Text> data.element;
            //		var bounds = element.getBounds();
            //		var tbounds = element.getTransformedBounds();
            //		var width = element.getMeasuredWidth();
            //		var height = element.getMeasuredHeight();
            //		height += element.getMeasuredLineHeight();
            //		width = element.getBounds().width;
            //		setTimeout(this._timeoutCache.bind(this, data.element, tbounds.width + 20, tbounds.height + 20), 200 );
            //		data.element.uncache();
        };
        /**
         * @todo This still needs a lot of work, there are major issues with the fact that we do not know how every specific
         * browser positions canvas text. There should be a matrix that caches and corrects the inconsistencies of every
         * browser. And a adjusts it accordingly so every browser shows text in the same way.
         *
         * @private
         * @method _timeoutCache
         * @param {createjs.Text} element
         * @param {number} width
         * @param {number} height
         */
        EaselTextManager.prototype._timeoutCache = function (element, width, height) {
            // "start", "end", "left", "right", and "center"
            switch (element.textAlign) {
                case 'start':
                    {
                        break;
                    }
                case 'end':
                    {
                        break;
                    }
                case 'left':
                    {
                        element.cache(0, 0, width, height);
                        break;
                    }
                case 'right':
                    {
                        element.cache(0, 0, width, height);
                        break;
                    }
                case 'center':
                    {
                        element.cache(-width / 2, 0, width, height);
                        break;
                    }
            }
        };
        return EaselTextManager;
    })(AbstractElementManager_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EaselTextManager;
});
