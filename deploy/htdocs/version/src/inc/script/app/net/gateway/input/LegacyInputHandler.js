define(["require", "exports"], function (require, exports) {
    /**
     * Maps the current 'legacy' gateway to the new spec, so the new interfaces can be used in all other places.
     *
     * @class LegacyInputHandler
     */
    var LegacyInputHandler = (function () {
        function LegacyInputHandler() {
        }
        /**
         * @method format
         * @param {any} data
         * @returns {any} data
         */
        LegacyInputHandler.prototype.format = function (data) {
            if (data.success) {
                delete data.success;
                // todo: map pagination according to IPagination
                // we don't have specs in the legacy setup, so should be converted per project
                return data;
            }
            else {
                // todo: map validation according to IGatewayValidationError
                // we don't have specs in the legacy setup, so should be converted per project
                return {
                    error: {
                        code: data.code,
                        message: data.message
                    }
                };
            }
        };
        return LegacyInputHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LegacyInputHandler;
});
