import refdef from "def/ReferenceDefinitions";
import IGatewayError from "app/net/gateway/result/IGatewayError";
import KnockoutValidator from "./KnockoutValidator";
import IGatewayValidationError from "app/net/gateway/result/IGatewayValidationError";
import Log from "../Log";

/**
 *  ## KnockoutValidator Gateway Utils
 *  Util class to handle Gaia gateway results and update a KnockoutValidator instance accordingly.
 *
 *  @class KnockoutValidatorGatewayUtils
 *  @namespace temple.utils.knockoutvalidator
 */
class KnockoutValidatorGatewayUtils {

	/**
	 * Reads field errors from a Gateway validation error and writes them to a KnockoutValidator instance.
	 * @param {IGatewayError} result The validation result
	 * @param {KnockoutValidator} validator The KnockoutValidator to write to
	 * @param {Object} [customMapping={}] An object with custom mappings that can be used if the field names in the
	 * gateway are different than the field names in the validator. The keys in this object should match field names in
	 * the gateway response, and their values should match field names in the validator.
	 * @method handleValidationError
	 */
	public static handleValidationError (result : IGatewayValidationError, validator : KnockoutValidator, customMapping : any = {}) : void {
		var fields = result.error.fields;
		for(var i=0; i<fields.length; i++) {
			var name = fields[i].field;
			if(typeof customMapping[name] != 'undefined') name = customMapping[name];

			var field = validator.field(name);
			// check if field exists
			if(field.name) {
				if(fields[i].message) {
					field.errors.push(fields[i].message);
				} else {
					field.isValid(false);
				}
			} else {
				Log.warn('Temple.Utils.KnockoutValidator.GatewayUtils', 'could not find field with name '+ name);
			}
		}
	}

	/**
	 * Checks if the given error is a validationError and if so, runs
	 * {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidatorGatewayUtils/handleValidationError:method"}}handleValidationError{{/crossLink}}
	 * @param {IGatewayError} result
	 * @param {KnockoutValidator} validator
	 * @param {Object} [customMapping={}]
	 * @method handleError
	 */
	public static handleError (result : IGatewayError, validator : KnockoutValidator, customMapping : any = {}) : void {
		if(result.error.code == "error.form.validation") {
			KnockoutValidatorGatewayUtils.handleValidationError(<IGatewayValidationError> result, validator, customMapping);
		}
	}
}

export default KnockoutValidatorGatewayUtils;