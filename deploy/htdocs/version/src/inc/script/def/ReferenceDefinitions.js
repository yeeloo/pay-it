/// <reference path="definitions.d.ts" />
define(["require", "exports"], function (require, exports) {
    /**
     * If you import this class instead of referencing the above line to your own class,
     * the PHPStorm syntax highlighter gives less errors
     * Also, this file can be imported as an absolute path instead of a relative on for the d.ts
     */
    var ReferenceDefinitions = (function () {
        function ReferenceDefinitions(name) {
            if (name === void 0) { name = ''; }
            this.name = name;
        }
        return ReferenceDefinitions;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReferenceDefinitions;
});
