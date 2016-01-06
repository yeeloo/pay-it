define(["require", "exports", 'lib/gaia/api/Gaia'], function (require, exports, Gaia) {
    var Deeplink = (function () {
        function Deeplink() {
        }
        Deeplink.prototype.add = function (key, value) {
            this[key] = value;
            return this;
        };
        Deeplink.prototype.copy = function (key) {
            this[key] = Gaia.api.getParam(key);
            return this;
        };
        return Deeplink;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Deeplink;
});
