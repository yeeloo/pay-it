define(["require", "exports"], function (require, exports) {
    /**
     *
     * PROBABLY     0	if the specified type appears to be playable.
     * MAYBE	    1	if it's impossible to tell whether the type is playable without playing it.
     * NO	        2	if the specified type definitely cannot be played.
     * @enum CanPlayEnum
     */
    var CanPlayEnum;
    (function (CanPlayEnum) {
        CanPlayEnum[CanPlayEnum["PROBABLY"] = 0] = "PROBABLY";
        CanPlayEnum[CanPlayEnum["MAYBE"] = 1] = "MAYBE";
        CanPlayEnum[CanPlayEnum["NO"] = 2] = "NO";
    })(CanPlayEnum || (CanPlayEnum = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CanPlayEnum;
});
