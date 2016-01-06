define(["require", "exports", "./Log"], function (require, exports, Log_1) {
    var _log = new Log_1.default('lib.temple.utils.Color');
    var Color = (function () {
        /**
         * Color utility class.
         *
         * @constructor
         * @class Color
         */
        function Color() {
            /**
             * The alpha value of the color.
             *
             * @property a
             * @type number
             */
            this.a = 1;
        }
        /**
         * Set value based on hex string.
         *
         * @method setHex
         * @param {string} hex Hexadecimal input string.
         * @return {void}
         */
        Color.prototype.setHex = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            this.r = parseInt(result[1], 16);
            this.g = parseInt(result[2], 16);
            this.b = parseInt(result[3], 16);
        };
        /**
         * Get color as hex value.
         *
         * @method getHex
         * @return {string}
         */
        Color.prototype.getHex = function () {
            return "#" + ((1 << 24) + (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b)).toString(16).slice(1);
        };
        /**
         * Set value based on "rgb()" string.
         *
         * @method setRgbString
         * @param {string} hex RGB input string.
         * @return {void}
         */
        Color.prototype.setRgbString = function (rgb) {
            var result = rgb.replace(/[^\d,]/g, '').split(',');
            var r = parseInt(result[0], 10);
            var g = parseInt(result[1], 10);
            var b = parseInt(result[2], 10);
            if (result.length !== 3 || r > Color.CLAMP || r < 0 || g > Color.CLAMP || g < 0 || b > Color.CLAMP || b < 0) {
                _log.warn('setRgbString: ' + rgb + 'is not a valid input!');
                return;
            }
            this.r = r;
            this.g = g;
            this.b = b;
        };
        /**
         * Get color as rgb() string.
         *
         * @method getRgbString
         * @return {string}
         */
        Color.prototype.getRgbString = function () {
            return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        };
        /**
         * Set value based on "rgba()" string.
         *
         * @method setRgbaString
         * @param {string} rgba Rgba input string.
         * @return {void}
         */
        Color.prototype.setRgbaString = function (rgba) {
            var result = rgba.replace(/[^\d,]/g, '').split(',');
            var r = parseInt(result[0], 10);
            var g = parseInt(result[1], 10);
            var b = parseInt(result[2], 10);
            var a = parseInt(result[3], 10);
            if (result.length !== 4 || r > Color.CLAMP || r < 0 || g > Color.CLAMP || g < 0 || b > Color.CLAMP || b < 0 || a > 1 || a < 0) {
                _log.warn('setRgbaString: ' + rgba + 'is not a valid input!');
                return;
            }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        };
        /**
         * Get color as rgba() string.
         *
         * @method getRgbaString
         * @return {string}
         */
        Color.prototype.getRgbaString = function () {
            return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
        };
        /**
         * Set value based on direct input.
         *
         * @method setRgb
         * @param {any} color Input object (r:number; g:number; b:number; a?:number (optional)).
         * @return {void}
         */
        Color.prototype.setRgb = function (color) {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            if (color.a)
                this.a = color.a;
            return this;
        };
        /**
         * Get color as rgb.
         *
         * @method getRgb
         * @returns {any} {r:number; g:number; b:number;}
         */
        Color.prototype.getRgb = function () {
            return {
                r: this.r,
                g: this.g,
                b: this.b
            };
        };
        /**
         * Set value of the color based on hsl input.
         *
         * @method setHsl
         * @param {any} color Input object {h:number; s:number; l:number;}.
         * @return {void}
         */
        Color.prototype.setHsl = function (color) {
            this.h = color.h;
            this.s = color.s;
            this.l = color.l;
            this.hslToRgb();
        };
        /**
         * Get color as hsl.
         *
         * @method getHsl
         * @return {any} {h:number; s:number; l:number;}
         */
        Color.prototype.getHsl = function () {
            this.rgbToHsl();
            return {
                h: this.h,
                s: this.s,
                l: this.l
            };
        };
        /**
         * Set value of the color based on hsv input.
         *
         * @method setHsv
         * @param {object} hsv Input object (h:number; s:number; v:number;)
         * @return {void}
         */
        Color.prototype.setHsv = function (color) {
            this.h = color.h;
            this.s = color.s;
            this.v = color.v;
            this.hsvToRgb();
        };
        /**
         * Get color as hsv.
         *
         * @method getHsv
         * @returns {object}
         * @return {any} {h:number; s:number; v:number}
         */
        Color.prototype.getHsv = function () {
            this.rgbToHsl();
            return {
                h: this.h,
                s: this.s,
                v: this.v
            };
        };
        /**
         * Set hue of the color.
         *
         * @method setHue
         * @param {number} hue Input hue.
         * @return void
         */
        Color.prototype.setHue = function (hue) {
            this.h = hue;
            this.hslToRgb();
        };
        /**
         * Get the hue of the color.
         *
         * @method getHue
         * @return {number}
         */
        Color.prototype.getHue = function () {
            this.rgbToHsl();
            return this.h;
        };
        /**
         * Set saturation of the color.
         *
         * @method setSaturation
         * @param {number} saturation Input saturation.
         * @return {void}
         */
        Color.prototype.setSaturation = function (saturation) {
            this.s = saturation;
            this.hsvToRgb();
        };
        /**
         * Get the saturation of the color.
         *
         * @method getSaturation
         * @return {number}
         */
        Color.prototype.getSaturation = function () {
            this.rgbToHsl();
            return this.s;
        };
        /**
         * Set the brightness of the color.
         *
         * @method setBrightness
         * @param {number} brightness Input brightness.
         * @return {void}
         */
        Color.prototype.setBrightness = function (brightness) {
            this.v = brightness;
            this.hsvToRgb();
        };
        /**
         * Get the brightness of the color.
         *
         * @method getBrightness
         * @return {number}
         */
        Color.prototype.getBrightness = function () {
            this.rgbToHsl();
            return this.v;
        };
        /**
         * Set the lightness of the color.
         *
         * @method setLightness
         * @param {number} lightness Input lightness
         * @return {void}
         */
        Color.prototype.setLightness = function (lightness) {
            this.l = lightness;
            this.hslToRgb();
        };
        /**
         * Get lightness of the color.
         *
         * @method getLightness
         * @return {number}
         */
        Color.prototype.getLightness = function () {
            this.rgbToHsl();
            return this.v;
        };
        /**
         * Applies matrix color operation to the color.
         *
         * @method applyMatrixFilter
         * @param {number[]} m Color transformation matrix
         * @return {void}
         */
        Color.prototype.applyMatrixFilter = function (m) {
            if (m.length < 20)
                return;
            this.r = this.r * m[0] + this.g * m[1] + this.b * m[2] + this.a * m[3] + m[4];
            this.g = this.r * m[5] + this.g * m[6] + this.b * m[7] + this.a * m[8] + m[9];
            this.b = this.r * m[10] + this.g * m[11] + this.b * m[12] + this.a * m[13] + m[14];
            this.a = this.r * m[15] + this.g * m[16] + this.b * m[17] + this.a * m[18] + m[19];
        };
        /**
         * Interpolates between two colors.
         *
         * @method interpolate
         * @param {Color} destination Color to interpolate to.
         * @param {number} factor Interpolation factor.
         * @returns {Color}
         */
        Color.prototype.interpolate = function (destination, factor) {
            this.r = Color.absround(+(this.r) + (destination.r - this.r) * factor);
            this.g = Color.absround(+(this.g) + (destination.g - this.g) * factor);
            this.b = Color.absround(+(this.b) + (destination.b - this.b) * factor);
            this.a = Color.absround(+(this.a) + (destination.a - this.a) * factor);
            return this;
        };
        /**
         * @private
         * converts object's rgb to hsl
         */
        Color.prototype.rgbToHsl = function () {
            var r = this.r / Color.CLAMP;
            var g = this.g / Color.CLAMP;
            var b = this.b / Color.CLAMP;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var l = (max + min) / 2;
            var v = max;
            if (max == min) {
                this.h = 0;
                this.s = 0;
                this.l = Color.absround(l * 100);
                this.v = Color.absround(v * 100);
                return;
            }
            var _d = max - min;
            var _s = _d / ((l <= 0.5) ? (max + min) : (2 - max - min));
            var _h = ((max == r)
                ? (g - b) / _d + (g < b ? 6 : 0)
                : (max == g)
                    ? ((b - r) / _d + 2)
                    : ((r - g) / _d + 4)) / 6;
            this.h = Color.absround(_h * 360);
            this.s = Color.absround(_s * 100);
            this.l = Color.absround(l * 100);
            this.v = Color.absround(v * 100);
        };
        /**
         * @private
         * converts object's hsl to rgb
         */
        Color.prototype.hslToRgb = function () {
            var h = this.h / 360;
            var s = this.s / 100;
            var l = this.l / 100;
            var q = l < 0.5 ? l * (1 + s) : (l + s - l * s);
            var p = 2 * l - q;
            this.r = Color.absround(Color.hue2rgb(p, q, h + 1 / 3) * 255);
            this.g = Color.absround(Color.hue2rgb(p, q, h) * 255);
            this.b = Color.absround(Color.hue2rgb(p, q, h - 1 / 3) * 255);
        };
        /**
         * @private
         * converts object's hsv to rgb
         */
        Color.prototype.hsvToRgb = function () {
            var h = this.h / 360;
            var s = this.s / 100;
            var v = this.v / 100;
            var r = 0;
            var g = 0;
            var b = 0;
            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
            }
            this.r = Color.absround(r * 255);
            this.g = Color.absround(g * 255);
            this.b = Color.absround(b * 255);
        };
        /**
         * @private
         * makes a number absolute/rounded
         */
        Color.absround = function (c) {
            return (0.5 + c) << 0;
        };
        /**
         * @private
         * converts hue to rgb
         */
        Color.hue2rgb = function (a, b, c) {
            if (c < 0)
                c += 1;
            if (c > 1)
                c -= 1;
            if (c < 1 / 6)
                return a + (b - a) * 6 * c;
            if (c < 1 / 2)
                return b;
            if (c < 2 / 3)
                return a + (b - a) * (2 / 3 - c) * 6;
            return a;
        };
        Color.CLAMP = 0xFF;
        return Color;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Color;
});
