import refdef from "def/ReferenceDefinitions";

/**
 * @class ValidatorFieldAccessor
 * @namespace temple.utils.knockoutvalidator
 */
interface ValidatorFieldAccessor {
    /**
     * A Knockout computed that returns if the field has been validated.
     * @property isValidated
     * @default false
     * @type KnockoutComputed
     */
    isValidated : KnockoutComputed<boolean>;
    /**
     * A Knockout computed that returns if the field is currently validating asynchronously.
     * @property isValidating
     * @default false
     * @type KnockoutComputed
     */
    isValidating : KnockoutComputed<boolean>;
    /**
     * A Knockout observable with a boolean indicating if the field is valid. Returns null if the field is not
     * validated.
     * @property isValid
     * @default null
     * @type KnockoutObservable
     */
    isValid : KnockoutObservable<boolean>;
    /**
     * A Knockout observable array containing error messages, if any has been set. If you write a new error message to
     * this observable, the isValid property will automatically be set to false. If isValid state of the field changes
     * to true, this error message will automatically be removed.
     * @property errors
     * @default null
     * @type KnockoutObservable
     */
    errors : KnockoutObservableArray<string>;
    /**
     * A Knockout observable with the value of field. You can also write to this observable to update the value.
     * @property value
     * @default null
     * @type KnockoutObservable
     */
    value : KnockoutObservable<any>;
    /**
     * A Knockout computed that returns the value at the time the field was last validated. Returns null if the field
     * is not validated.
     * @property validatedValue
     * @default null
     * @type KnockoutComputed
     */
    validatedValue : KnockoutComputed<any>;
    /**
     * The name of the field
     * @property name
     * @type string
     */
    name : string;
}

export default ValidatorFieldAccessor;