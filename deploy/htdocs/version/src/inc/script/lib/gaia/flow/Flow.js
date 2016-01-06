define(["require", "exports"], function (require, exports) {
    var Flow;
    (function (Flow) {
        Flow[Flow["NORMAL"] = "normal"] = "NORMAL";
        Flow[Flow["CROSS"] = "cross"] = "CROSS";
        Flow[Flow["PRELOAD"] = "preload"] = "PRELOAD";
    })(Flow || (Flow = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Flow;
});
