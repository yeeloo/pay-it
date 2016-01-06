var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../core/Destructible", "../ThrottleDebounce"], function (require, exports, Destructible_1, ThrottleDebounce_1) {
    /**
     * This is an enum for use in {{#crossLink "temple.utils.ui.ElementResizer"}}ElementResizer{{/crossLink}}
     * @namespace temple.utils.ui
     * @class ScaleMode
     * @enum
     */
    (function (ScaleMode) {
        /**
         * Resizes the element to fill its bounds
         * @property COVER
         */
        ScaleMode[ScaleMode["COVER"] = 0] = "COVER";
        /**
         * Resizes the element to fit to its bounds
         * @property CONTAIN
         */
        ScaleMode[ScaleMode["CONTAIN"] = 1] = "CONTAIN";
        /**
         * Only applies alignment, does not scale the rectangle
         * @property ALIGN_ONLY
         */
        ScaleMode[ScaleMode["ALIGN_ONLY"] = 2] = "ALIGN_ONLY";
    })(exports.ScaleMode || (exports.ScaleMode = {}));
    var ScaleMode = exports.ScaleMode;
    /**
     * An implementation of `background-size: cover/contain` in TypeScript.
     *
     * After initializing this class, run {{#crossLink "temple.utils.ui.ElementResizer/update"}}{{/crossLink}} to
     * resize the element based on its settings. It is also possible to have it auto-update on window resize by calling the
     * {{#crossLink "temple.utils.ui.ElementResizer/autoResize"}}{{/crossLink}} function after initializing.
     *
     * If you want to do a one-off resize, * use the static method
     * {{#crossLink "temple.utils.ui.ElementResizer/resize"}}ElementResizer.resize{{/crossLink}}, or if you just want to get
     * the x/y and width/height of an arbitrary rectangle, use
     * {{#crossLink "temple.utils.ui.ElementResizer/getRect"}}ElementResizer.getRect{{/crossLink}}, which returns an
     * IRectangle
     *
     * Updating any of the public properties will automatically resize the element
     *
     * @namespace temple.utils.ui
     * @extends temple.core.Destructible
     * @class ElementResizer
     * @author Stuart van Beek <stuart@mediamonks.com>
     * @constructor
     * @param _element {HTMLElement} The element to resize
     * @param _elementWidth {number} element width/x ratio, e.g. for a 100x200 element you can either pass 100 or 1 as width
     * @param _elementHeight {number} element height/y ratio, e.g. for a 100x200 element you can either pass 200 or 2 as height
     * @param [_sizingType=COVER] {temple.utils.ui.ScaleMode} Sizing type, defaults to COVER
     * @param [_boundsContainer] {HTMLElement} The container to fit/fill the element to, defaults to its parent
     * @param [_alignmentX=0.5] {number} X alignment of the resulting element, where 0 = left and 1 = right
     * @param [_alignmentY=0.5] {number} Y alignment of the resulting element, where 0 = top and 1 = bottom
     * @param [_maxWidth] {number} Maxmimum width of the element, respects the X alignment
     * @param [_maxHeight] {number} Maxmimum height of the element, respects the Y alignment
     *
     * @returns {temple.utils.ui.ElementResizer}
     */
    var ElementResizer = (function (_super) {
        __extends(ElementResizer, _super);
        function ElementResizer(_element, _elementWidth, _elementHeight, _scaleMode, _boundsContainer, _alignmentX, _alignmentY, _maxWidth, _maxHeight) {
            if (_scaleMode === void 0) { _scaleMode = ScaleMode.COVER; }
            if (_boundsContainer === void 0) { _boundsContainer = void 0; }
            if (_alignmentX === void 0) { _alignmentX = 0.5; }
            if (_alignmentY === void 0) { _alignmentY = 0.5; }
            _super.call(this);
            this._element = _element;
            this._elementWidth = _elementWidth;
            this._elementHeight = _elementHeight;
            this._scaleMode = _scaleMode;
            this._boundsContainer = _boundsContainer;
            this._alignmentX = _alignmentX;
            this._alignmentY = _alignmentY;
            this._maxWidth = _maxWidth;
            this._maxHeight = _maxHeight;
            if (this._boundsContainer == void 0) {
                if (this._element.parentElement == void 0) {
                    throw new Error('ElementResizer: element has no container, unable to calculate scaling');
                }
                this._boundsContainer = this._element.parentElement;
            }
        }
        /**
         * Resize an element once based on ratio, scalemode, alignment and max size. This method wraps
         * {{#crossLink "temple.utils.ui.ElementResizer/getRect"}}ElementResizer.getRect{{/crossLink}}, but applies CSS to
         * the element.
         *
         * @public
         * @static
         * @method resize
         *
         * @param element {HTMLElement} Element on which to apply the width/height left/right styles to.
         * @param elementWidth {number} element width/x ratio, e.g. for a 100x200 element you can either pass 100 or 1 as width
         * @param elementHeight {number} element height/y ratio, e.g. for a 100x200 element you can either pass 200 or 2 as height
         * @param [scaleMode=COVER] {temple.utils.ui.ScaleMode} Scale mode (COVER or RESIZE)
         * @param [boundsContainer] {HTMLElement} Container which it will respect the bounds of.
         * @param [alignmentX=0.5] {number} X alignment of the resulting element, where 0 = left and 1 = right
         * @param [alignmentY=0.5] {number} Y alignment of the resulting element, where 0 = top and 1 = bottom
         * @param [maxWidth] {number} Maxmimum width of the element
         * @param [maxHeight] {number} Maxmimum height of the element
         *
         * @returns {temple.geom.IRectangle}
         */
        ElementResizer.resize = function (element, elementWidth, elementHeight, scaleMode, boundsContainer, alignmentX, alignmentY, maxWidth, maxHeight) {
            if (scaleMode === void 0) { scaleMode = ScaleMode.COVER; }
            if (boundsContainer === void 0) { boundsContainer = element.parentElement; }
            if (alignmentX === void 0) { alignmentX = 0.5; }
            if (alignmentY === void 0) { alignmentY = 0.5; }
            if (boundsContainer.parentElement == void 0) {
                throw new Error('ElementResizer: element has no container, unable to calculate scaling');
            }
            // this method just wraps getRect, and creates an IRectangle for it using the bounds container element
            var rect = ElementResizer.getRect(elementWidth, elementHeight, scaleMode, { x: 0, y: 0, width: boundsContainer.clientWidth, height: boundsContainer.clientHeight }, alignmentX, alignmentY, maxWidth, maxHeight);
            // and finally applies the result to the element
            element.style.top = rect.y.toString() + "px";
            element.style.left = rect.x.toString() + "px";
            element.style.width = rect.width.toString() + "px";
            element.style.height = rect.height.toString() + "px";
            return rect;
        };
        /**
         * Resize an element once based on ratio, scalemode, alignment and max size.
         *
         * @public
         * @static
         * @method getRect
         *
         * @param elementWidth {number} element width/x ratio, e.g. for a 100x200 element you can either pass 100 or 1 as width
         * @param elementHeight {number} element height/y ratio, e.g. for a 100x200 element you can either pass 200 or 2 as height
         * @param [scaleMode=COVER] {temple.utils.ui.ScaleMode} Scale mode (COVER or RESIZE)
         * @param [boundsContainer] {IRectangle} Container which it will respect the bounds of. x/y properties can be set to
         * 0 since they are not used (the interface requires them)
         * @param [alignmentX=0.5] {number} X alignment of the resulting rectangle, where 0 = left and 1 = right
         * @param [alignmentY=0.5] {number} Y alignment of the resulting rectangle, where 0 = top and 1 = bottom
         * @param [maxWidth] {number} Maxmimum width of the element, respects the X alignment
         * @param [maxHeight] {number} Maxmimum height of the element, respects the Y alignment
         *
         * @returns {temple.geom.IRectangle}
         */
        ElementResizer.getRect = function (elementWidth, elementHeight, scaleMode, boundsContainer, alignmentX, alignmentY, maxWidth, maxHeight) {
            if (scaleMode === void 0) { scaleMode = ScaleMode.COVER; }
            if (alignmentX === void 0) { alignmentX = 0.5; }
            if (alignmentY === void 0) { alignmentY = 0.5; }
            if (boundsContainer == void 0) {
                throw new Error('ElementResizer: no bounds container supplied, unable to calculate scaling');
            }
            var targetWidth;
            var targetHeight;
            // get needed scale to fit in bounds with cover
            if (scaleMode == ScaleMode.CONTAIN || scaleMode == ScaleMode.COVER) {
                var boundRatioX = boundsContainer.width / elementWidth;
                var boundRatioY = boundsContainer.height / elementHeight;
                var scale = 1;
            }
            // get scale for bounds container
            switch (scaleMode) {
                case ScaleMode.CONTAIN:
                    {
                        scale = boundRatioX < boundRatioY ? boundRatioX : boundRatioY;
                        break;
                    }
                case ScaleMode.COVER:
                    {
                        scale = boundRatioX > boundRatioY ? boundRatioX : boundRatioY;
                        break;
                    }
                case ScaleMode.ALIGN_ONLY:
                    {
                        targetWidth = elementWidth;
                        targetHeight = elementHeight;
                        break;
                    }
                default:
                    {
                        throw new Error('ElementResizer: invalid ScaleMode');
                    }
            }
            if (scaleMode == ScaleMode.CONTAIN || scaleMode == ScaleMode.COVER) {
                // get needed scale to fit in max with contain
                if (maxWidth || maxHeight) {
                    var scaleMaxRatioX = scale;
                    var scaleMaxRatioY = scale;
                    if (maxWidth) {
                        scaleMaxRatioX = maxWidth / elementWidth;
                    }
                    if (maxHeight) {
                        scaleMaxRatioY = maxHeight / elementHeight;
                    }
                    var scaleMax = scaleMaxRatioX < scaleMaxRatioY ? scaleMaxRatioX : scaleMaxRatioY;
                    scale = Math.min(scale, scaleMax);
                }
                // do the actual scale
                targetWidth = elementWidth * scale;
                targetHeight = elementHeight * scale;
            }
            // and do alignment
            return {
                width: targetWidth,
                height: targetHeight,
                x: (boundsContainer.width - targetWidth) * alignmentX,
                y: (boundsContainer.height - targetHeight) * alignmentY
            };
        };
        Object.defineProperty(ElementResizer.prototype, "width", {
            get: function () {
                return this._elementWidth;
            },
            /**
             * @public
             * @property width {number}
             */
            set: function (value) {
                this._elementWidth = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "height", {
            get: function () {
                return this._elementHeight;
            },
            /**
             * @public
             * @property height {number}
             */
            set: function (value) {
                this._elementHeight = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "scaleMode", {
            get: function () {
                return this._scaleMode;
            },
            /**
             * @public
             * @property scaleMode {temple.utils.ui.ScaleMode}
             */
            set: function (value) {
                this._scaleMode = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "boundsContainer", {
            get: function () {
                return this._boundsContainer;
            },
            /**
             * @public
             * @property boundsContainer {HTMLElement}
             */
            set: function (value) {
                if (value == void 0) {
                    value = this._element.parentElement;
                }
                this._boundsContainer = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "alignmentX", {
            get: function () {
                return this._alignmentX;
            },
            /**
             * @public
             * @property alignmentX {number}
             */
            set: function (value) {
                this._alignmentX = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "alignmentY", {
            get: function () {
                return this._alignmentY;
            },
            /**
             * @public
             * @property alignmentY {number}
             */
            set: function (value) {
                this._alignmentY = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "maxWidth", {
            get: function () {
                return this._maxWidth;
            },
            /**
             * @public
             * @property maxWidth {number}
             */
            set: function (value) {
                this._maxWidth = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementResizer.prototype, "maxHeight", {
            get: function () {
                return this._maxHeight;
            },
            /**
             * @public
             * @property maxHeight {number}
             */
            set: function (value) {
                this._maxHeight = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Resize the element based on its registered settings. This method is also called on window resize.
         *
         * @public
         * @method update
         */
        ElementResizer.prototype.update = function () {
            ElementResizer.resize(this._element, this._elementWidth, this._elementHeight, this._scaleMode, this._boundsContainer, this._alignmentX, this._alignmentY, this._maxWidth, this._maxHeight);
        };
        /**
         * Enables updating on window resize. Applies a debounce to the event listener, of which the duration can be
         * configured.
         *
         * @public
         * @method autoResize
         * @param debounce {number=100} debounce duration in milliseconds
         */
        ElementResizer.prototype.autoResize = function (debounce) {
            var _this = this;
            if (debounce === void 0) { debounce = 100; }
            if (this._handleResize != void 0) {
                window.removeEventListener('resize', this._handleResize);
            }
            if (debounce == void 0 || debounce == 0) {
                // register listener without debounce
                this._handleResize = function (event) { return _this.handleResize(event); };
            }
            else {
                this._handleResize = ThrottleDebounce_1.default.debounce(this.handleResize, debounce, this);
            }
            window.addEventListener('resize', this._handleResize);
        };
        /**
         * Event listener for window.onresize
         *
         * @private
         * @method handleResize
         * @param event {UIEvent}
         */
        ElementResizer.prototype.handleResize = function (event) {
            this.update();
        };
        /**
         * @inheritDoc
         */
        ElementResizer.prototype.destruct = function () {
            if (this._handleResize != void 0) {
                window.removeEventListener('resize', this._handleResize);
                this._handleResize = void 0;
            }
            _super.prototype.destruct.call(this);
        };
        return ElementResizer;
    })(Destructible_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ElementResizer;
});
