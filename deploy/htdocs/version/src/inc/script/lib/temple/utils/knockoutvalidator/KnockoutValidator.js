var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'knockout', "lib/temple/core/Destructible", "../Log"], function (require, exports, ko, Destructible_1, Log_1) {
    var _log = new Log_1.default('lib.temple.utils.knockoutvalidator.KnockoutValidator');
    /**
     *  ## KnockoutValidator
     *  Class that allows you to validate forms using Knockout.js. Main features:
     *  - Clean up your template code by moving validation settings to viewmodels
     *  - Validate fields with custom rules
     *  - Validate custom (non-input) html element
     *  - Auto-validate fields on change
     *  - Allows async validation with promises
     *
     *  ### Getting started
     *  To get started using KnockoutValidator, create a new KnockoutValidator instance.
     *  ```typescript
     *  public myValidator = new KnockoutValidator();
     *  ```
     *  Then bind your input fields to this instance using the validateWith binding:
     *  ```html
     *  <form data-bind="validateWith : myValidator">
     *      <input type="text" name="first-name" data-bind="validationRule : myRule">
     *      <input type="text" name="last-name" data-bind="validationRule : myRule">
     *  </form>
     *  ```
     *  Or use the *validator* binding to bind each input separately:
     *  ```html
     *  <form>
     *      <input type="text" name="first-name" data-bind="validator : myValidator, validationRule : myRule/">
     *      <input type="text" name="last-name" data-bind="validator : myValidator, validationRule : myRule/">
     *  </form>
     *  ```
     *
     *  To validate all fields in a validator, use the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/validate:method"}}validate(){{/crossLink}} method.
     *  It returns a boolean specifying if all the fields are valid. You can also have fields validate automatically by
     *  using the *validateOn* binding. See the binding reference below.
     *
     *  You can reference the element later using it's *name* attribute. Make sure it always have a unique name or manually
     *  enter one using the *validationName* binding.
     *
     *  ### Binding reference
     *  You can find an explanation of each knockout binding that you can use to control validation below.
     *
     *  ##### The validateWith binding
     *  This will bind all child elements that have a *validationRule*, *validationValue*, *validationName* or *validateOn*
     *  binding to the specified validator. See an example in 'getting started' above.
     *
     *  ##### The validator binding
     *  Will bind a single input field to a validator. See an example in 'getting started' above.
     *
     *  ##### The validationRule binding
     *  Specifies the rules that the field value must follow in order to be valid. It accepts the following types:
     *  - **regular expression**
     *    ```html
     *    <input type="text" name="only-lowercase" value="" data-bind="validationRule : /^[a-z]*$//">
     *    ```
     *  - **string** Will be converted to a regular expression.
     *    ```html
     *    <input type="text" name="only-lowercase" value="" data-bind="validationRule : '^[a-z]*$'">
     *    ```
     *  - **boolean** Can only be used on checkboxes. True for checked, false for not checked.
     *  - **a function with the following signature:**
     *    ```typescript
     *    (value : any, name : string) => boolean | string | Promise<boolean | string>
     *    ```
     *    The value and name parameters are the current name and value of the field to validate. You can return:
     *    + a boolean indicating if the field is valid
     *    + a string containing an error message (empty string will set the field to valid)
     *    + a Promise that resolves with a boolean or string. For more information on using Promises, see *async validation* below.
     *    ```html
     *    <input type="text" name="only-foo" value="" data-bind="validationRule : function(value) {return value == 'foo';}">
     *    ```
     *  You can also use any of these predefined functions:
     *   - {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/equals:method"}}$validator().equals('otherField'){{/crossLink}}:
     *  value has to be the same as that of another field.
     *   - {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/not:method"}}$validator().not(myRule){{/crossLink}}:
     *   inverts the output of a rule
     *   - {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/range:method"}}$validator().range(from, to, parse){{/crossLink}}:
     *  value has to be in between or equal to *from* and *to*. See
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/range:method"}}reference{{/crossLink}} for more details
     *
     *  You can reference a variable in your viewModel (recommended) or write your rules inline. It will also accept any of
     *  these types wrapped in an observable, or an (observable) array containing multiple rules. The value will only be
     *  valid if all of these rules evaluate to *true*.
     *
     *  ##### The validateOn binding
     *  Specifies when validation should occur on the field. On 'manual' (default) it will only validate if you call the
     *  validate() method on the KnockoutValidator instance. On 'value', it will also update whenever the value of the input
     *  changes. If you want to limit the rate at which the validation will automatically trigger (for example, if you're
     *  validating using a backend call), pass value(limit) to the binding where limit is the rate limit in ms.
     *  ```html
     *  <input type="text" name="auto-validate" data-bind="validationRule : /^.+$/, validateOn : 'value(300)'">
     *  <span data-bind="visible : $validator().field('auto-validate').isValid() === false">Input cannot be empty!</span>
     *  ```
     *  By default, the value attribute will only update on the 'change' event of the element. To add additional events,
     *  use [Knockout's valueUpdate](http://knockoutjs.com/documentation/value-binding.html) binding.
     *
     *  ##### The validationName binding
     *  By default, you can find fields using the name defined in the 'name' attribute on the element. If you do not want
     *  to use this name, you can specify a custom name using the *validationName* binding.
     *  ```html
     *  <input type="text" name="not-empty" data-bind="validationRule : /^.+$/, validationName : 'my-custom-name'">
     *  <span data-bind="visible : $validator().field('my-custom-name').isValid() === false">Input cannot be empty!</span>
     *  ```
     *
     *  ##### The validateRadio binding
     *  Because radio buttons consist of multiple elements, they have a separate binding. Instead of putting the validationRule
     *  binding on a radio button, put it on a parent element and add a validateRadio binding with the name of the radio
     *  buttons that you want to validate.
     *  ```html
     *  <div data-bind="validateRadio : 'select-foo', validationRule : 'foo'">
     *      <input type="radio" id="radio-1" name="select-foo" value="foo">
     *      <label for="radio-1">Foo</label>
     *      <input type="radio" id="radio-2" name="select-foo" value="bar" checked>
     *      <label for="radio-2">Bar</label>
     *  </div>
     *  ```
     *
     *  ### Getting results
     *  To check if all fields are valid, check the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/isValid:property"}}isValid{{/crossLink}}
     *  observable on the validator (**note:** this only updates
     *  if you trigger validation on fields. If not all fields are validated, returns null). To check individual fields,
     *  use the  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/field:method"}}field{{/crossLink}} method
     *  to get a {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor"}}ValidatorFieldAccessor{{/crossLink}}
     *  instance.
     *
     *  KnockoutValidator will also automatically apply classes to each validated element. For usage, see the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/validClassname:property"}}validClassname{{/crossLink}},
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/invalidClassname:property"}}invalidClassname{{/crossLink}},
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/validatingAsyncClassname:property"}}validatingAsyncClassname{{/crossLink}} and
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/applyClassesToParent:property"}}applyClassesToParent{{/crossLink}}
     *  properties in the reference below.
     *
     *  You can also access all values via the validator. Each
     *  {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor"}}ValidatorFieldAccessor{{/crossLink}} has a
     *  {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor/value:property"}}value{{/crossLink}} and
     *  {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor/validatedValue:property"}}validatedValue{{/crossLink}}
     *  observable. To get all values at once, use the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/getValues:method"}}getValues{{/crossLink}}
     *  or {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/serialize:method"}}serialize{{/crossLink}} method.
     *
     *  ### Global rules
     *  Global rules on a validator are not bound to an element, but are additional functions executed on validation that
     *  can contain any validation logic. To add a global rule, use the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/addGlobalRule:method"}}addGlobalRule{{/crossLink}}
     *  method. See the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/addGlobalRule:method"}}reference{{/crossLink}}
     *  below for more details on the usage of global rules.
     *
     *  ### Async validation
     *  If you want to perform validation on a field asynchronously (for example, if you want to validate with an AJAX
     *  call), you can pass a function that returns a Promise as a *validationRule*. The Promise object that is returned
     *  **must** use the [Promises/A+](https://promisesaplus.com/) standard, and has to resolve with a boolean value that
     *  indicates if the value is valid. **note**: when doing things like AJAX calls in combination with the validateOn
     *  binding, you probably want to specifiy a rate limit. See 'The validateOn binding' above.
     *
     *  When running the
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/validate:method"}}validate{{/crossLink}}
     *  method with async validation rules, it will return a Promise that resolves if validation is complete.
     *
     *  Async validation is currently only supported on single fields, not as a global rule.
     *
     *
     *  ### Usage with Gaia gateway results
     *  See
     *  {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidatorGatewayUtils"}}KnockoutValidatorGatewayUtils{{/crossLink}}
     *
     * @class KnockoutValidator
     * @namespace temple.utils.knockoutvalidator
     */
    var KnockoutValidator = (function (_super) {
        __extends(KnockoutValidator, _super);
        function KnockoutValidator() {
            _super.call(this);
            /**
             * Classname that KnockoutValidator will apply to elements with valid values (on last validation). Use null to
             * disable.
             * @property validClassname
             * @default null
             * @type string
             */
            this.validClassname = null;
            /**
             * Classname that KnockoutValidator will apply to elements with invalid values (on last validation). Use null to
             * disable.
             * @property invalidClassname
             * @default 'invalid'
             * @type string
             */
            this.invalidClassname = 'invalid';
            /**
             * Classname that KnockoutValidator will apply to elements while validating asynchronously. Use null to disable.
             * @property validatingAsyncClassname
             * @default 'validating'
             * @type string
             */
            this.validatingAsyncClassname = 'validating';
            /**
             * By default, KnockoutValidator will apply the
             * {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/validClassname:property"}}validClassname{{/crossLink}},
             * {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/invalidClassname:property"}}invalidClassname{{/crossLink}} or
             * {{#crossLink "temple.utils.knockoutvalidator.KnockoutValidator/validatingAsyncClassname:property"}}validatingAsyncClassname{{/crossLink}}
             * classes to the element that is being validated. If this is set to true, it will apply these classes to the parent
             * element instead.
             * @property applyClassesToParent
             * @default true
             * @type boolean
             */
            this.applyClassesToParent = false;
            /**
             * Timeout for async validation. If validation takes longer than this value, it will throw a warning and return
             * false (or invalid). If 0, validation will never timeout.
             * @property asyncTimeout
             * @default 5000
             * @type number
             */
            this.asyncTimeout = 5000;
            this._fieldValidSubscriptions = [];
            // Unlike isValidating, this boolean will also be true if validating synchronously
            this._isValidating = false;
            this._globalRules = [];
            KnockoutValidator.init();
            this.isValid = ko.observable(null);
            this._fields = ko.observableArray([]);
            this.isValidating = ko.computed(function () {
                var fields = this._fields(), validating = false;
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].isValidating()) {
                        validating = true;
                    }
                }
                return validating;
            }, this, { pure: true });
            this.fields = ko.computed(function () {
                var output = [], fields = this._fields();
                for (var i = 0; i < fields.length; i++) {
                    output.push(fields[i].accessor);
                }
                return output;
            }, this, { pure: true });
        }
        /**
         * Triggers validation on all fields and returns the result.
         * @method validate
         * @return {boolean|Promise} Returns a boolean indicating if all the fields have successfully validated. If one
         * of the fields has an asynchronous rule, it will return a Promise that will resolve with a boolean value once all
         * the fields have completed validating.
         */
        KnockoutValidator.prototype.validate = function () {
            var _this = this;
            var valid = true, asyncTimeoutId = null, fields, result, promises;
            // Check if the call is coming from the correct scope. Might be wrong if attached as event handler
            if (!(this instanceof KnockoutValidator)) {
                _log.warn("validate() called from the wrong scope.");
                if (typeof this._fields == 'undefined') {
                    return;
                }
            }
            if (this._isValidating) {
                _log.warn("calling the validate() while already validating.");
                return null;
            }
            this._isValidating = true;
            fields = this._fields.peek();
            promises = [];
            for (var i = 0; i < fields.length; i++) {
                // Stop the fields from triggering validation themselves during validation
                fields[i].preventAutoValidation = true;
                // Get the validation result
                result = fields[i].validate();
                if (PromiseUtils.isPromise(result)) {
                    promises.push(result);
                }
            }
            // Run the global rules
            for (var i = 0; i < this._globalRules.length; i++) {
                var globalRuleResult = this._globalRules[i](this);
                if (typeof globalRuleResult != 'undefined' && !globalRuleResult) {
                    // This will make sure the return value of the validate() function is false
                    valid = false;
                }
            }
            for (var i = 0; i < fields.length; i++) {
                // Re-enable auto validation
                fields[i].preventAutoValidation = false;
                // Make sure that we return false if one of the fields is invalid
                if (fields[i].isValid.peek() === false) {
                    valid = false;
                }
            }
            if (promises.length) {
                this.isValid(null);
                if (this.asyncTimeout) {
                    asyncTimeoutId = setTimeout(function () {
                        _log.warn('Validation timed out.');
                        _this.isValid(false);
                        _this._isValidating = false;
                    }, this.asyncTimeout);
                }
                // Wait for all promises to complete
                PromiseUtils.all(promises).then(function () {
                    if (asyncTimeoutId !== null) {
                        clearTimeout(asyncTimeoutId);
                    }
                    _this._isValidating = false;
                    _this._updateValidState();
                });
            }
            else {
                // Not async. Immediately apply validation
                this.isValid(valid);
                this._isValidating = false;
                this._updateValidState();
            }
            return valid;
        };
        /**
         * Global rules on a validator are not bound to an element, but are additional rules executed on validation
         * that can contain any logic. To mark a field as invalid, set the isValid observable on the field to *false*.
         * @method addGlobalRule
         * @param {any} rule
         * @example
         *  ```javascript
         *  // Javascript viewModel
         *  function checkIncreasing(validator) {
         *     var currentValue = null;
         *     for(var i=0; i<viewModel.numbers.length; i++) {
         *         var field = validator.field(viewModel.numbers[i]),
         *             val = parseInt(field.value(),10);
         *         if(!isNaN(val) && (currentValue == null || val > currentValue)) {
         *             currentValue = val;
         *         } else {
         *             field.isValid(false);
         *             return false;
         *         }
         *     }
         *     return true;
         *  }
         *  viewModel.myValidator = new KnockoutValidator();
         *  viewModel.myValidator.addGlobalRule('isIncreasing', checkIncreasing, 'value');
         *  viewModel.numbers = ['first', 'second', 'third', 'fourth'];
         *  ```
         *  ```html
         *  <!-- Only validate if values in inputs are in increasing order. -->
         *  <form data-bind="validateWith : myValidator, validateOn : 'value', foreach : numbers">
         *  <input type="number" value="" data-bind="validationName : $data">
         *  </form>
         *  <span data-bind="visible : myValidator.isValid">Valid!</span>
         *  ```
         */
        KnockoutValidator.prototype.addGlobalRule = function (rule) {
            this._globalRules.push(rule);
        };
        /**
         * Removes all global rules
         * @method clearGlobalRules
         */
        KnockoutValidator.prototype.clearGlobalRules = function () {
            this._globalRules.length = 0;
        };
        /**
         * Returns an object with the field names as keys and the field values as values.
         * @method getValues
         * @param {boolean} [validated=false] If true, get the
         * {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor/property:method"}}validated values{{/crossLink}}
         * instead of the current values.
         * @return {any}
         */
        KnockoutValidator.prototype.getValues = function (validated) {
            if (validated === void 0) { validated = false; }
            var values = {}, fields = this._fields();
            for (var i = 0; i < fields.length; i++) {
                values[fields[i].name] = validated ? fields[i].validatedValueReadOnly() : fields[i].value();
            }
            return values;
        };
        /**
         * Returns a string with all values in URL-encoded notation (like
         * [JQuery's serialize()](http://api.jquery.com/serialize/) method).
         * @method serialize
         * @param {boolean} [validated=false] If true, get the
         * {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor/validatedValue:property"}}validated values{{/crossLink}}
         * instead of the current values.
         * @return {string}
         */
        KnockoutValidator.prototype.serialize = function (validated) {
            if (validated === void 0) { validated = false; }
            var values = this.getValues(validated), outputValues = [];
            for (var i in values) {
                if (values.hasOwnProperty(i)) {
                    if (typeof values[i] == 'Array') {
                        for (var j = 0; j < values[i].length; j++) {
                            outputValues.push(i + '=' + encodeURIComponent(values[i][j]));
                        }
                    }
                    else {
                        outputValues.push(i + '=' + encodeURIComponent(values[i]));
                    }
                }
            }
            return outputValues.join('&');
        };
        /**
         * Returns a function that evaluates to true if the input value is the same as the value on another field.
         * @method equals
         * @param {string} name The name of the field to compare to
         * @return {function} The comparison function that can be used as a validationRule
         */
        KnockoutValidator.prototype.equals = function (name) {
            var _this = this;
            return function (value) {
                var field = _this._findByName(name);
                if (field) {
                    return value == field.value();
                }
                return false;
            };
        };
        /**
         * Returns a
         * {{#crossLink "temple.utils.knockoutvalidator.ValidatorFieldAccessor"}}ValidatorFieldAccessor{{/crossLink}}
         * instance for the specified field, containing information about its value and validation results.
         * @method field
         * @param {string} name The name of the field to retrieve
         * @return {temple.utils.knockoutvalidator.ValidatorFieldAccessor}
         */
        KnockoutValidator.prototype.field = function (name) {
            var field = this._findByName(name);
            if (field) {
                return field.accessor;
            }
            return KnockoutValidator._emptyAccessor;
        };
        /**
         * Returns a function evaluates to true if length of a value it is in between or equal to 'from' and 'to'. Pass
         * null or undefined to skip a parameter. If 'parse' is true, it will try to parse the value to a float and use
         * that instead of the length.
         * @method range
         * @param {number} [from=null] Minimum value. Use null for no minimum
         * @param {number} [to=null] Maximum value. Use null for no maximum
         * @param {boolean} [parse=false] If true, tests the value parsed to a float instead of the value length.
         * @return {function} The function that can be used as a validationRule
         */
        KnockoutValidator.prototype.range = function (from, to, parse) {
            if (parse === void 0) { parse = false; }
            return function (value) {
                var num;
                if (parse) {
                    num = parseFloat(value);
                    if (isNaN(num)) {
                        return false;
                    }
                }
                else {
                    num = value.length;
                }
                if (from !== null && num < from) {
                    return false;
                }
                if (to !== null && num > to) {
                    return false;
                }
                return true;
            };
        };
        /**
         * Returns an InverseRule object that will invert the output of the given ValidationRule. This function only accepts
         * single validation rules, not an array of rules.
         * @method not
         * @param {string | RegExp | function | boolean} function The input function
         * @return {InverseRule} The InverseRule object that can be used as a validation rule.
         */
        KnockoutValidator.prototype.not = function (rule) {
            if (rule instanceof Array) {
                throw "The not() rule does not accept multiple rules!";
            }
            return new InverseRule(ko.unwrap(rule));
        };
        /**
         * Destruct the instance. Always call this when navigating away from your page to clean up any references!
         */
        KnockoutValidator.prototype.destruct = function () {
            for (var i = 0; i < this._fieldValidSubscriptions.length; i++) {
                this._fieldValidSubscriptions[i].dispose();
            }
            this.isValidating.dispose();
            this.fields.dispose();
            _super.prototype.destruct.call(this);
        };
        KnockoutValidator.prototype._fieldIsValidChangeHandler = function (isValid) {
            // We only execute the change handler if we are not validating, to prevent all handlers firing at once
            if (!this._isValidating) {
                if (isValid === null) {
                    // Field is not validated. Set isValid to null.
                    this.isValid(null);
                }
                else if (isValid === false && this.isValid.peek() !== null) {
                    // Field is invalid and we are not validating. Set isValid to false.
                    this.isValid(false);
                }
                else {
                    // Field is valid or we were still validating. We need to check all other fields.
                    this._updateValidState();
                }
            }
        };
        KnockoutValidator.prototype._updateValidState = function () {
            var valid = true, fields = this._fields.peek();
            for (var i = 0; i < fields.length; i++) {
                var fieldValid = fields[i].isValid.peek();
                if (fieldValid === null) {
                    this.isValid(null);
                    return;
                }
                else if (!fieldValid) {
                    valid = false;
                }
            }
            this.isValid(valid);
        };
        /*
         * Looks up a ValidatorField instance by its name property.
         */
        KnockoutValidator.prototype._findByName = function (name) {
            var fields = this._fields();
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].name == name) {
                    return fields[i];
                }
            }
            return null;
        };
        /*
         * Attaches a ValidatorField instance to a KnockoutValidator
         */
        KnockoutValidator.prototype._attach = function (field) {
            this._fields.push(field);
            this._fieldValidSubscriptions.push(field.isValid.subscribe(this._fieldIsValidChangeHandler, this));
        };
        /*
         * Detaches a ValidatorField instance from a KnockoutValidator
         */
        KnockoutValidator.prototype._detach = function (field) {
            var fields = this._fields.peek(), i = fields.length;
            while (i--) {
                if (fields[i] == field) {
                    this._fieldValidSubscriptions[i].dispose();
                    this._fieldValidSubscriptions.splice(i, 1);
                    this._fields.splice(i, 1);
                }
            }
        };
        /**
         * Initializes the knockout bindings, if that has not yet been done.
         * Usually you won't have to execute this manually. It will be called from the KnockoutValidator constructor.
         * @method init
         * @static
         */
        KnockoutValidator.init = function () {
            if (!this._initialized) {
                if (typeof document.body.addEventListener == "undefined") {
                    _log.warn("KnockoutValidator does not support this browser!");
                }
                if (typeof document.body.classList == "undefined") {
                    _log.warn("KnockoutValidator requires a browser with classList support. Please update your browser" +
                        " or polyfill classList");
                }
                this._creatEmptyAccessor();
                this._initBindings();
                this._initialized = true;
            }
        };
        /*
         * Initializes the empty accessor object. This is returned every time a requested field is not found. This makes
         * sure that no errors will be thrown when the properties on these non-existed fields are called.
         */
        KnockoutValidator._creatEmptyAccessor = function (undefined) {
            KnockoutValidator._emptyAccessor = {
                isValid: function () {
                    return undefined;
                },
                isValidated: function () {
                    return undefined;
                },
                isValidating: function () {
                    return undefined;
                },
                errors: function () {
                    return [];
                },
                value: function () {
                    return undefined;
                },
                validatedValue: function () {
                    return undefined;
                },
                name: undefined
            };
        };
        /*
         * Initializes all the Knockout bindings related to the Validator.
         */
        KnockoutValidator._initBindings = function () {
            // Initialize validateWith separately, since it's not a binding on a field but on one of its parents
            ko.bindingHandlers['validateWith'] = {
                init: KnockoutValidator._koValidateWithInit
            };
            ko.virtualElements.allowedBindings['validateWith'] = true;
            // We create ValidatorFieldBinding instances so we don't have to process each binding separately
            var bindings = {
                'validator': new ValidatorFieldBinding('validator', '$validator'),
                'validateOn': new ValidatorFieldBinding('validateOn', '__koValidateOn', false),
                'validationRule': new ValidatorFieldBinding('rule'),
                'validationName': new ValidatorFieldBinding('name', null, false, false, 'name')
            };
            KnockoutValidator._forEachFieldBinding = function (f) {
                for (var i in bindings) {
                    if (bindings.hasOwnProperty(i)) {
                        f(bindings[i], i);
                    }
                }
            };
            KnockoutValidator._forEachFieldBinding(function (binding, key) {
                var handler = {
                    init: KnockoutValidator._koValidationBindingInit
                };
                if (binding.updatable) {
                    handler.update = KnockoutValidator._koValidationBindingUpdate(binding);
                }
                ko.bindingHandlers[key] = handler;
            });
        };
        /*
         * Gets the id of an element by looking at the data-attribute we set.
         * If the attribute does not exist yet we create it.
         */
        KnockoutValidator._getElementFieldId = function (element) {
            var idAttrName = KnockoutValidator.ATTRIBUTE_NAMESPACE + 'id', idAttr = element.getAttribute(idAttrName), id;
            if (idAttr == null) {
                id = KnockoutValidator._fieldIdCounter++;
                element.setAttribute(idAttrName, id + '');
            }
            else {
                id = parseInt(idAttr, 10);
            }
            return id;
        };
        /*
         * Attaches/detaches a ValidatorField to the correct validator if the validator on the field is different than
         * the specified previousValidator.
         */
        KnockoutValidator._bindFieldToValidator = function (field, previousValidator) {
            if (previousValidator != field.validator) {
                if (previousValidator !== null) {
                    previousValidator._detach(field);
                }
                if (field.validator !== null) {
                    field.validator._attach(field);
                }
            }
        };
        /*
         * 'init' method for custom bindings 'validator', 'validateOn', 'validationRule' and ''validationName'
         */
        KnockoutValidator._koValidationBindingInit = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var id = KnockoutValidator._getElementFieldId(element), tagName = element.tagName.toLowerCase(), inputType = element.getAttribute('type'), valueBindingKey = 'value', field = KnockoutValidator._validatorFieldMap[id] || null, radioName = null, value;
            // Ignore elements with validateWith binding, they get processed separately.
            if (allBindings.has('validateWith')) {
                return;
            }
            // If the field doesn't exist, initialize it.
            if (!field) {
                if (allBindings.has('validateRadio')) {
                    radioName = allBindings.get('validateRadio');
                }
                if (radioName !== null) {
                    value = KnockoutValidator._createRadioButtonObservable(element, radioName);
                }
                else {
                    // Find which type of knockout binding we should use to keep track of the value
                    if (tagName == 'input' || tagName == 'textarea') {
                        if (inputType == 'radio') {
                            throw 'Cannot use validation bindings on radio buttons. Please use ' +
                                'the "validateRadio" binding to validate radio buttons.';
                            return;
                        }
                        else if (inputType == 'checkbox') {
                            valueBindingKey = 'checked';
                        }
                    }
                    else if (tagName == 'select') {
                        if (element.hasAttribute('multiple')) {
                            if (allBindings.has('value')) {
                                throw 'KnockoutValidator: Please do not use the value bindings with ' +
                                    'a multiple-option select element. Use the selectedOptions binding instead.';
                            }
                            valueBindingKey = 'selectedOptions';
                        }
                    }
                    else {
                        _log.warn('KnockoutValidator: validation does not work on ' + tagName + ' elements.');
                        return;
                    }
                    if (allBindings.has(valueBindingKey)) {
                        // Element already has such a binding. We will use the same value as that binding.
                        value = allBindings.get(valueBindingKey);
                        if (!ko.isWriteableObservable(value)) {
                            throw 'KnockoutValidator does not work on elements that have a "' + valueBindingKey + '" binding ' +
                                'with a value that is not a writable observable nor a writable computed.';
                        }
                    }
                    else {
                        // Element has no such binding. Use a new observable as value and bind it ourselves.
                        value = ko.observable('');
                        ko.bindingHandlers[valueBindingKey].init(element, function () {
                            return value;
                        }, allBindings, viewModel, bindingContext);
                        ko.computed({
                            read: function () {
                                var fieldValue = value();
                                ko.unwrap(fieldValue);
                                if (typeof ko.bindingHandlers[valueBindingKey].update == 'function') {
                                    ko.bindingHandlers[valueBindingKey].update(element, function () {
                                        return fieldValue;
                                    }, allBindings, viewModel, bindingContext);
                                }
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }
                var field = new ValidatorField(element, id, value);
                KnockoutValidator._validatorFieldMap[id] = field;
                KnockoutValidator._forEachFieldBinding(function (binding, bindingKey) {
                    // Initialize non-updatable bindings
                    if (!binding.updatable && allBindings.has(bindingKey)) {
                        field[binding.propertyName] = ko.unwrap(allBindings.get(bindingKey));
                    }
                    if (!allBindings.has(bindingKey)) {
                        // Initialize inheritance from context
                        if (binding.inheritFromContext) {
                            var contextValue = bindingContext[binding.inheritFromContext];
                            if (typeof contextValue != 'undefined') {
                                field.bindPropertyToObservable(binding.propertyName, contextValue, binding.clearResults);
                            }
                        }
                        else if (binding.inheritFromAttribute) {
                            if (element.hasAttribute(binding.inheritFromAttribute)) {
                                field[binding.propertyName] = element.getAttribute(binding.propertyName);
                            }
                        }
                    }
                });
                if (!field.name) {
                    if (radioName !== null) {
                        field.name = radioName;
                    }
                    else {
                        // No name on attribute, create a generic name
                        var nameDataAttribute = KnockoutValidator.ATTRIBUTE_NAMESPACE + 'name', id = KnockoutValidator._nameCounter++, newName = 'unknown' + id;
                        element.setAttribute(nameDataAttribute, newName);
                        field.name = newName;
                    }
                }
                field.accessor.name = field.name;
                // Add the disposal callback so the field is cleaned nicely.
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    var id = KnockoutValidator._getElementFieldId(element), field = KnockoutValidator._validatorFieldMap[id];
                    if (field) {
                        if (field.validator) {
                            field.validator._detach(field);
                        }
                        KnockoutValidator._validatorFieldMap[id] = null;
                        field.destruct();
                    }
                });
                KnockoutValidator._bindFieldToValidator(field, null);
            }
        };
        /*
         * Creates an observable and binds it to child radio button elements
         */
        KnockoutValidator._createRadioButtonObservable = function (element, radioName) {
            var value = ko.observable(''), pauseValueUpdate = false;
            function isRadio(element, name) {
                if (name === void 0) { name = null; }
                return element && element.tagName.toLowerCase() == 'input'
                    && element.getAttribute('type').toLowerCase() == 'radio'
                    && (name === null || element.getAttribute('name') == name);
            }
            function updateObservable() {
                var radios = document.getElementsByName(radioName), oldValue = value.peek(), newValue = null;
                for (var i = 0; i < radios.length; i++) {
                    var radio = radios[i];
                    if (radio.checked) {
                        newValue = radio.getAttribute('value');
                        break;
                    }
                }
                pauseValueUpdate = true;
                if (oldValue != newValue)
                    value(newValue);
                pauseValueUpdate = false;
            }
            element.addEventListener('click', function (event) {
                var target = event.target;
                if (isRadio(target, radioName)) {
                    updateObservable();
                }
            }, true);
            var subscription = value.subscribe(function (newValue) {
                if (!pauseValueUpdate) {
                    var radios = document.getElementsByName(radioName);
                    for (var i = 0; i < radios.length; i++) {
                        var radio = radios[i];
                        if (isRadio(radio) && radio.getAttribute('value') == newValue) {
                            radio.checked = true;
                            break;
                        }
                    }
                }
            });
            updateObservable();
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                subscription.dispose();
            });
            return value;
        };
        /*
         * Returns 'update' method for custom bindings 'validator', 'validateOn', 'validationRule' and ''validationName'
         */
        KnockoutValidator._koValidationBindingUpdate = function (binding) {
            return function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var id = KnockoutValidator._getElementFieldId(element), field = KnockoutValidator._validatorFieldMap[id] || null;
                // Ignore elements with validateWith binding, they get processed separately.
                if (allBindings.has('validateWith')) {
                    return;
                }
                // Make sure we have a ValidatorField to work with.
                if (!field) {
                    throw 'KnockoutValidator binding update method called on element that has no field attached to it.';
                }
                var currentValidator = field.validator || null, clearResults = false, bindingValue = ko.unwrap(valueAccessor());
                // On some bindings we want to clear the results if the property updates.
                if (binding.clearResults && field[binding.propertyName] != bindingValue) {
                    clearResults = true;
                }
                field[binding.propertyName] = bindingValue;
                if (clearResults) {
                    field.clearValidationResults();
                }
                KnockoutValidator._bindFieldToValidator(field, currentValidator);
            };
        };
        /*
         * Init method for the 'validateWith' binding
         */
        KnockoutValidator._koValidateWithInit = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var validateWidth = valueAccessor(), context = {};
            // Wrap the value in an observable and add it to the context
            context.$validator = ko.isObservable(validateWidth) ? validateWidth : ko.observable(validateWidth);
            // Loop through all bindings, find the ones that inherit from context
            KnockoutValidator._forEachFieldBinding(function (binding, bindingKey) {
                if (binding.inheritFromContext && allBindings.has(bindingKey)) {
                    // Wrap binding value in observable and add it to context
                    var bindingValue = allBindings.get(bindingKey);
                    context[binding.inheritFromContext] = ko.isObservable(bindingValue) ? bindingValue : ko.observable(bindingValue);
                }
            });
            var innerBindingContext = bindingContext.extend(context);
            ko.applyBindingsToDescendants(innerBindingContext, element);
            return { controlsDescendantBindings: true };
        };
        /**
         * Prefix for HTML attributes that will be applied to elements for internal use.
         * @property ATTRIBUTE_NAMESPACE
         * @static
         * @default 'data-ko-validator-'
         * @type string
         */
        KnockoutValidator.ATTRIBUTE_NAMESPACE = 'data-ko-validator-';
        // Enabled knockout bindings to find a ValidatorField instance belonging to an element
        KnockoutValidator._validatorFieldMap = {};
        // Used to assign an unique id to each field
        KnockoutValidator._fieldIdCounter = 0;
        // Used to assign a name to a field if no name is set
        KnockoutValidator._nameCounter = 0;
        // To make sure we only initialize once
        KnockoutValidator._initialized = false;
        return KnockoutValidator;
    })(Destructible_1.default);
    /*
     * The ValidatorField class is a helper class for KnockoutValidator that is instantiated for every HTML Element
     * that is bound to a KnockoutValidator instance.
     */
    var ValidatorField = (function (_super) {
        __extends(ValidatorField, _super);
        function ValidatorField(element, id, value) {
            _super.call(this);
            this.element = element;
            this.id = id;
            this.value = value;
            // Computed instead of observable, so we can make it read-only
            this.isValidated = null;
            // Is used by the update binding, to prevent it's called too many times
            this.skipUpdateOn = [];
            // Used to prevent auto validation when we are already in the validate() method of a KnockoutValidator
            this.preventAutoValidation = false;
            // The accessor will contain properties of this field that can be accessed from outside the validator
            this.accessor = null;
            // Timeout ID for validateOn with rate limit.
            this._pendingValidationID = null;
            // Keep track of listeners so we can clear them if needed
            this._subscriptions = [];
            var _validatedValue = ko.observable(null);
            this._validatedValue = _validatedValue;
            this.isValidating = ko.observable(false);
            this.isValid = ko.observable(null);
            this.errors = ko.observableArray([]);
            this.isValidated = ko.computed(function () {
                return this.value() !== null;
            }, this, { pure: true });
            this.validatedValueReadOnly = ko.computed(function () {
                return _validatedValue();
            }, this, { pure: true });
            this.isValidatingReadOnly = ko.computed(function () {
                return this.isValidating();
            }, this, { pure: true });
            this._initAccessor();
            this._subscriptions.push(this.isValid.subscribe(this._isValidChangeHandler, this));
            this._subscriptions.push(this.errors.subscribe(this._errorsChangeHandler, this));
            this._subscriptions.push(this.value.subscribe(this._valueChangeHandler, this));
        }
        /*
         * Runs validation on the field and updates it's properties (e.g. isValid, errors) accordingly. Returns a the
         * isValid state of the field when all rules are synchronous, otherwise returns a Promise that resolves with
         * the isValid state.
         */
        ValidatorField.prototype.validate = function () {
            var _this = this;
            // Create a temporary state to keep track of validation of individual rules.
            var isValid = true, errors = [], promises = [], value = this.value.peek(), rules = ((this.rule instanceof Array) ? this.rule : [this.rule]);
            function processRuleResult(result, inverse) {
                // Check the type of the result
                if (PromiseUtils.isPromise(result)) {
                    // Promise. Push to promise array for later processing.
                    promises.push(result);
                    result.then(function (promiseResult) {
                        processRuleResult(promiseResult, inverse);
                    }, function (message) {
                        processRuleResult(false, false);
                        _log.warn('KnockoutValidator: one of the validation rules rejected a promise with message: ' + message);
                    });
                    return;
                }
                if (typeof result == 'string') {
                    // String. Push the new error message
                    if (!inverse && result != '') {
                        errors.push(result);
                    }
                }
                else {
                    // Convert to boolean
                    if ((inverse && result) || (!inverse && !result)) {
                        isValid = false;
                    }
                }
            }
            var saveValidation = function () {
                _this.isValidating(false);
                _this.isValid(isValid && !errors.length);
                _this.errors(errors);
            };
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i], inverse = false, result;
                // Unpack any inverse rules
                while (rule instanceof InverseRule) {
                    rule = rule.rule;
                    inverse = !inverse;
                }
                result = ValidatorField._validateWithSingleRule(value, this.name, rule);
                processRuleResult(result, inverse);
            }
            if (promises.length) {
                // Indicate that we are validating
                this.isValidating(true);
                // If valid state is already null, clearing results won't trigger _applyValidationClasses, so we do that ourselves
                if (this.isValid.peek() === null) {
                    this._applyValidationClasses();
                }
                // Clear validation results.
                this.clearValidationResults();
                // Return a promise that resolves when the validation is done, but save validation first.
                return PromiseUtils.all(promises).then(saveValidation, saveValidation);
            }
            saveValidation();
            return isValid && !errors.length;
        };
        /*
         * Removes all validation results from the field.
         */
        ValidatorField.prototype.clearValidationResults = function () {
            this.isValid(null);
            this._validatedValue(null);
            this.errors([]);
        };
        /*
         * Subscribes to an observable value and writes that value to a property of this field on change. If clearResults
         * is true, will call clearValidationResults() on change.
         */
        ValidatorField.prototype.bindPropertyToObservable = function (property, value, clearResults) {
            this._subscriptions.push(value.subscribe(function (newValue) {
                this[property] = newValue;
                if (clearResults) {
                    this.clearValidationResults();
                }
            }, this));
            value.notifySubscribers(value.peek());
        };
        ValidatorField.prototype._valueChangeHandler = function () {
            var _this = this;
            var autoValidate = false, rateLimit = 0;
            if (!this.preventAutoValidation) {
                if (this.validateOn == 'value') {
                    autoValidate = true;
                }
                else {
                    var rateLimitTest = /value\(([0-9]+)\)/, result = rateLimitTest.exec(this.validateOn);
                    if (result !== null) {
                        autoValidate = true;
                        rateLimit = parseInt(result[1], 10);
                    }
                }
                if (autoValidate) {
                    if (rateLimit > 0) {
                        if (this._pendingValidationID !== null) {
                            clearTimeout(this._pendingValidationID);
                        }
                        this._pendingValidationID = setTimeout(function () {
                            _this.validate();
                        }, rateLimit);
                    }
                    else {
                        this.validate();
                    }
                }
            }
        };
        ValidatorField.prototype.destruct = function () {
            this._disposeSubscriptions();
            this.isValidatingReadOnly.dispose();
            this.isValidated.dispose();
            this.validatedValueReadOnly.dispose();
            _super.prototype.destruct.call(this);
        };
        /*
         * Sets all the properties on the field accessor that should be accessible from outside the validator.
         */
        ValidatorField.prototype._initAccessor = function () {
            this.accessor = {
                isValidated: this.isValidated,
                isValid: this.isValid,
                errors: this.errors,
                isValidating: this.isValidatingReadOnly,
                value: this.value,
                validatedValue: this.validatedValueReadOnly,
                name: this.name
            };
        };
        /*
         * Adds/removes validation classes, if needed
         */
        ValidatorField.prototype._applyValidationClasses = function () {
            var valid = this.isValid.peek(), element = this.element, classes = [
                { name: this.validator.validatingAsyncClassname, apply: this.isValidating.peek() },
                { name: this.validator.validClassname, apply: valid },
                { name: this.validator.invalidClassname, apply: valid === false }
            ];
            if (this.validator.applyClassesToParent) {
                element = element.parentElement;
                if (!element) {
                    return;
                }
            }
            for (var i = 0; i < classes.length; i++) {
                if (classes[i].name) {
                    var action = classes[i].apply ? 'add' : 'remove';
                    element.classList[action](classes[i].name);
                }
            }
        };
        /*
         * Runs whenever the isValid state changes
         */
        ValidatorField.prototype._isValidChangeHandler = function (newValue) {
            if (newValue !== null) {
                this._validatedValue(newValue);
                // If the field is valid, remove any error messages
                if (newValue) {
                    this.errors([]);
                }
            }
            this._applyValidationClasses();
        };
        /*
         * Runs whenever the error messages change
         */
        ValidatorField.prototype._errorsChangeHandler = function (newValue) {
            if (newValue && newValue.length) {
                this.isValid(false);
            }
        };
        /*
         * Removes all Knockout subscriptions that the field is using
         */
        ValidatorField.prototype._disposeSubscriptions = function () {
            for (var i = 0; i < this._subscriptions.length; i++) {
                this._subscriptions[i].dispose();
            }
            this._subscriptions = [];
        };
        ValidatorField._validateWithSingleRule = function (value, name, rule) {
            if (typeof rule == 'boolean') {
                return value == rule;
            }
            if (typeof rule == 'string') {
                rule = new RegExp(rule);
            }
            if (typeof rule == 'function') {
                var result = rule(value, name);
                return result;
            }
            if (rule instanceof RegExp) {
                return (typeof value == 'string') ? rule.test(value) : false;
            }
            return true;
        };
        return ValidatorField;
    })(Destructible_1.default);
    var InverseRule = (function () {
        function InverseRule(rule) {
            this.rule = rule;
        }
        return InverseRule;
    })();
    /*
     * Small helper class to deal with A+ Promises. Since we don't know what implementation is used, we have to write
     * some functionality ourselves.
     */
    var PromiseUtils = (function () {
        function PromiseUtils() {
        }
        /*
         * Checks if a variable is a Promise by definition
         */
        PromiseUtils.isPromise = function (val) {
            return ((typeof val == 'function' || typeof val == 'object') && typeof val.then == 'function');
        };
        /*
         * Receives an array of minimum 1 Promise and returns a new Promise that resolves when all promises are complete.
         */
        PromiseUtils.all = function (promises) {
            if (typeof Object.getPrototypeOf == 'undefined') {
                throw 'KnockoutValidator needs Object.getPrototypeOf for async functionality.';
            }
            // We cannot handle empty arrays because then we don't have a promise implementation to work with
            if (!promises.length) {
                throw 'PromiseUtils: cannot call all() with an empty array.';
            }
            var Promise = Object.getPrototypeOf(promises[0]).constructor;
            return new Promise(function (resolve, reject) {
                var complete = 0, rejected = false;
                for (var i = 0; i < promises.length; i++) {
                    promises[i].then(function () {
                        complete++;
                        if (complete == promises.length && !rejected) {
                            resolve();
                        }
                    }, function (data) {
                        rejected = true;
                        reject(data);
                    });
                }
            });
        };
        return PromiseUtils;
    })();
    /* Helper class for abstraction of the knockout binding for validator fields */
    var ValidatorFieldBinding = (function () {
        function ValidatorFieldBinding(// corresponding property to update on a ValidatorField
            propertyName, 
            // name of the variable in the Knockout binding context that is used when the data-bind is not present
            inheritFromContext, 
            // boolean indicating if we should unwrap the value in the data-bind before saving it on the field
            clearResults, 
            // boolean indicating if we should update the field when the data-bind value updates
            updatable, 
            // name of the HTML attribue that is used when the data-bind is not present
            inheritFromAttribute) {
            if (inheritFromContext === void 0) { inheritFromContext = null; }
            if (clearResults === void 0) { clearResults = true; }
            if (updatable === void 0) { updatable = true; }
            if (inheritFromAttribute === void 0) { inheritFromAttribute = null; }
            this.propertyName = propertyName;
            this.inheritFromContext = inheritFromContext;
            this.clearResults = clearResults;
            this.updatable = updatable;
            this.inheritFromAttribute = inheritFromAttribute;
        }
        return ValidatorFieldBinding;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KnockoutValidator;
});
