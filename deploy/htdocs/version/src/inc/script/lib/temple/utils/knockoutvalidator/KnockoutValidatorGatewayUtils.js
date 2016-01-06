define(["require", "exports", "../Log"], function (require, exports, Log_1) {
    /**
     *  ## KnockoutValidator Gateway Utils
     *  Util class to handle Gaia gateway results and update a KnockoutValidator instance accordingly.
     *
     *  @class KnockoutValidatorGatewayUtils
     *  @namespace temple.utils.knockoutvalidator
     */
    var KnockoutValidatorGatewayUtils = (function () {
        function KnockoutValidatorGatewayUtils() {
        }
        /**
         * Reads field errors from a Gateway validation error and writes them to a KnockoutValidator instance.
         * @param {IGatewayError} result The validation result
         * @param {KnockoutValidator} validator The KnockoutValidator to write to
         * @param {Object} [customMapping={}] An object with custom mappings that can be used if the field names in the
         * gateway are different than the field names in the validator. The keys in this object should match field names in
         * the gateway response, and their values should match field names in the validator.
         * @method handleValidationError
         */
        KnockoutValidatorGatewayUtils.handleValidationError = function (result, validator, customMapping) {
            if (customMapping === void 0) { customMapping = {}; }
            var fields = result.error.fields;
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].field;
                if (typeof customMapping[name] != 'undefined')
                    name = customMapping[name];
                var field = validator.field(name);
                // check if field exists
                if (field.name) {
                    if (fields[i].message) {
                        field.errors.push(fields[i].message);
                    }
                    else {
                        field.isValid(false);
                    }
                }
                else {
                    Log_1.default.warn('Temple.Utils.KnockoutValidator.GatewayUtils', 'could not find field with name ' + name);
                }
            }
        };
        /**
         * Checks if the given error is a validationError and if so, runs
         * {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidatorGatewayUtils/handleValidationError:method"}}handleValidationError{{/crossLink}}
         * @param {IGatewayError} result
         * @param {KnockoutValidator} validator
         * @param {Object} [customMapping={}]
         * @method handleError
         */
        KnockoutValidatorGatewayUtils.handleError = function (result, validator, customMapping) {
            if (customMapping === void 0) { customMapping = {}; }
            if (result.error.code == "error.form.validation") {
                KnockoutValidatorGatewayUtils.handleValidationError(result, validator, customMapping);
            }
        };
        return KnockoutValidatorGatewayUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KnockoutValidatorGatewayUtils;
});
