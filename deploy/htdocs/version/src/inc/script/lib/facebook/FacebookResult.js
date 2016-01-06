define(["require", "exports"], function (require, exports) {
    var FacebookResult = (function () {
        function FacebookResult(success, data) {
            if (data === void 0) { data = null; }
            this.success = success;
            this.data = data;
        }
        return FacebookResult;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FacebookResult;
});
