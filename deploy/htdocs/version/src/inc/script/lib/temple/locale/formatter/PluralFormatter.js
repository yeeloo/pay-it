define(["require", "exports", "./util/Pluralize"], function (require, exports, Pluralize_1) {
    /**
     * @module Temple
     * @namespace temple.locale.formatter
     * @class PluralFormatter
     */
    var PluralFormatter = (function () {
        function PluralFormatter(replacements) {
            this.replacements = replacements;
        }
        /**
         * @public
         * @method format
         * @param {string} text
         * @returns {string}
         */
        PluralFormatter.prototype.format = function (text) {
            var _this = this;
            for (var name in this.replacements) {
                if (this.replacements.hasOwnProperty(name)) {
                    text = text.replace(new RegExp('{' + name + '}', 'gi'), this.replacements[name]);
                    // {enkelvound|aantal|meervoud}
                    text = text.replace(new RegExp('{([^|{}]+)\\|' + name + '(?:\\|([^}]+))?}', 'gmi'), function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        return _this._pluralize(args[1], _this.replacements[name], args[2]);
                    });
                }
            }
            return text;
        };
        /**
         * @private
         * @param {string} noun
         * @param {any} count
         * @param {string} plural
         * @returns {string}
         */
        PluralFormatter.prototype._pluralize = function (noun, count, plural) {
            if (plural === void 0) { plural = null; }
            if (typeof count === 'string') {
                count = isNaN(parseInt(count)) ? (count == 'one' ? 1 : 2) : parseInt(count);
            }
            return Pluralize_1.default.pluralize(noun, count, plural);
        };
        return PluralFormatter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PluralFormatter;
});
