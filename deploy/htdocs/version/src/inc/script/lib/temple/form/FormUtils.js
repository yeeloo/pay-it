define(["require", "exports", "../utils/Log"], function (require, exports, Log_1) {
    var FormUtils = (function () {
        function FormUtils() {
        }
        FormUtils.getValue = function (name, form) {
            var input = $("[name='" + name + "']", form)[0];
            if (input) {
                return input.value;
            }
            else {
                Log_1.default.error('Temple.Util.FormUtils', "No input found with name '" + name + "'");
            }
            return null;
        };
        return FormUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FormUtils;
});
