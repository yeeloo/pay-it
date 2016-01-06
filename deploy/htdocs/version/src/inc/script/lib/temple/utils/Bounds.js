define(["require", "exports"], function (require, exports) {
    /**
     * @class Bounds
     * @namespace temple.utils
     * @author Pieter van de Sluis
     */
    var Bounds = (function () {
        /**
         * The Bounds class allows calculations on values within two bounds and translation to other bounds.
         *
         * Constructs a new Bounds instance. The from/to values don't necessarily have to be in lower/higher order,
         * the Bounds class works with both ascending and descending ranges.
         *
         * @constructor
         * @class Bounds
         * @param from {number} The first boundary value
         * @param to {number} The second boundary value
         * @param [numSteps=0] {number} The number of steps within the bounds. Values will automatically snap to these steps. If 0, step functionality is disabled.
         */
        function Bounds(from, to, numSteps) {
            if (numSteps === void 0) { numSteps = 0; }
            this._numSteps = 0;
            this._stepSize = 0;
            this._from = from;
            this._to = to;
            this.updateSize();
            this.updateDirection();
            if (numSteps != 0) {
                this.setNumSteps(numSteps);
            }
        }
        /**
         * Translates a value within two bounds to target bounds.
         * The input value is automatically constrained to the source bounds.
         *
         * @method translateValue
         * @static
         * @param value {number} The value that is to be translated
         * @param sourceFrom {number} The first boundary value of the source bounds
         * @param sourceTo {number} The second boundary value of the source bounds
         * @param [targetFrom=0] {number} The first boundary value of the target bounds
         * @param [targetTo=1] {number} The second boundary value of the target bounds
         * @return {number} The translated value
         */
        Bounds.translateValue = function (value, sourceFrom, sourceTo, targetFrom, targetTo) {
            if (targetFrom === void 0) { targetFrom = 0; }
            if (targetTo === void 0) { targetTo = 1; }
            return new Bounds(sourceFrom, sourceTo).translate(value, new Bounds(targetFrom, targetTo));
        };
        /**
         * Translates a value within the bounds to a factor (0-1).
         * The input value is automatically constrained to the bounds.
         *
         * @method getFactorFromValue
         * @param value {number} A value within the bounds
         * @return {number} The factor within the bounds
         */
        Bounds.prototype.getFactorFromValue = function (value) {
            return this.applyStepSnapToFactor(Math.abs((this.constrain(value) - this._from) / this._size));
        };
        /**
         * Snaps the factor to the closest step
         *
         * @private
         * @method applyStepSnapToFactor
         * @param factor {number} The factor
         * @returns {number} The snapped factor
         */
        Bounds.prototype.applyStepSnapToFactor = function (factor) {
            if (this._numSteps == 0)
                return factor;
            var factorStepSize = 1 / this._numSteps;
            return Math.round(factor / factorStepSize) * factorStepSize;
        };
        /**
         * Translates a factor (0-1) to a value within the bounds.
         * The input value is automatically constrained to 0-1.
         *
         * @method getValueFromFactor
         * @param factor {number} The factor
         * @return {number} The value within the bounds
         */
        Bounds.prototype.getValueFromFactor = function (factor) {
            factor = this.applyStepSnapToFactor(this.constrainTo(factor, 0, 1));
            return this._from + this._direction * (factor * this._size);
        };
        /**
         * Translates a value within this bounds to a target bounds
         *
         * @method translate
         * @param value {number} A value within the bounds
         * @param targetBounds {Bounds} The target bounds that the value should be translated to
         * @return {number} The translated value
         */
        Bounds.prototype.translate = function (value, targetBounds) {
            return targetBounds.getValueFromFactor(this.getFactorFromValue(value));
        };
        /**
         * Constrains a value to the bounds
         *
         * @method constrain
         * @param value {number} The value that should be constrained
         * @return {number} The constrained value
         */
        Bounds.prototype.constrain = function (value) {
            if (this._to > this._from) {
                return this.constrainTo(value, this._from, this._to);
            }
            else {
                return this.constrainTo(value, this._to, this._from);
            }
        };
        /**
         * Constrains a value to an upper and lower limit
         *
         * @private
         * @method constrainTo
         * @param value {number} The value that should be constrained
         * @param lower {number} The lower limit
         * @param upper {number} The upper limit
         * @return {number} The constrained value
         */
        Bounds.prototype.constrainTo = function (value, lower, upper) {
            if (value >= upper)
                return upper;
            if (value <= lower)
                return lower;
            return value;
        };
        /**
         * Scales the size of the bounds
         *
         * @method scale
         * @param scaleFactor {number} The amount that the bounds should be scaled. 1.0 equals 100% scale.
         * @return {number} The new size of the bounds
         */
        Bounds.prototype.scale = function (scaleFactor) {
            if (scaleFactor < 0) {
                // Flip from-to values
                var tempTo = this._to;
                this._to = this._from;
                this._from = tempTo;
                this._direction *= -1;
                scaleFactor *= -1;
            }
            var newSize = this._size * scaleFactor;
            var boundaryChange = (newSize - this._size) * 0.5;
            this._from -= this._direction * boundaryChange;
            this._to += this._direction * boundaryChange;
            return this.updateSize();
        };
        /**
         * Get a random value within the bounds
         *
         * @method getRandomValue
         * @return {number} the random number
         */
        Bounds.prototype.getRandomValue = function () {
            return this.getValueFromFactor(Math.random());
        };
        /**
         * Checks whether a value is within the bounds
         *
         * @method contains
         * @param value {number} The value
         * @return {boolean} Whether the value is within the bounds
         */
        Bounds.prototype.contains = function (value) {
            return (this._from <= value && value <= this._to) || (this._from <= value && value <= this._to);
        };
        /**
         * When numSteps or stepSize have been set, this returns the discrete steps within the bounds.
         *
         * @method getSteps
         * @return {array} Array containing the steps, or null if numSteps/stepSize is 0.
         */
        Bounds.prototype.getSteps = function () {
            if (this._numSteps == 0) {
                return null; // step mechanism is disabled when _numSteps is 0
            }
            else if (this._numSteps == 1) {
                return [this._from, this._to];
            }
            var steps = [];
            steps.push(this._from);
            for (var i = 1; i < this._numSteps; i++) {
                steps.push(this._from + this._direction * (this._stepSize * i));
            }
            steps.push(this._to);
            return steps;
        };
        /**
         * Calculates the size of the bounds and updates the step size accordingly
         *
         * @private
         * @method updateSize
         * @return {number} The new size
         */
        Bounds.prototype.updateSize = function () {
            this._size = Math.abs(this._from - this._to);
            this._stepSize = this._size / this._numSteps;
            return this._size;
        };
        /**
         * Updates the direction of the bounds. 1 for ascending, -1 for descending.
         *
         * @private
         * @method updateDirection
         */
        Bounds.prototype.updateDirection = function () {
            this._direction = (this._to > this._from) ? 1 : -1;
        };
        /**
         * Gets the size of the bounds (the distance between from and to values)
         *
         * @method getSize
         * @return {number} The size of the bounds
         */
        Bounds.prototype.getSize = function () {
            return this._size;
        };
        /**
         * Gets the _from_ value
         *
         * @method getFrom
         * @return The _from_ value
         */
        Bounds.prototype.getFrom = function () {
            return this._from;
        };
        /**
         * Sets the _from_ value. Changing this also automatically adjusts the stepSize property.
         *
         * @method setFrom
         * @param value {number} The _from_ value
         */
        Bounds.prototype.setFrom = function (value) {
            this._from = value;
            this.updateSize();
            this.updateDirection();
        };
        /**
         * Gets the _to_ value
         *
         * @method getTo
         * @return The _to_ value
         */
        Bounds.prototype.getTo = function () {
            return this._to;
        };
        /**
         * Sets The _to_ value. Changing this also automatically adjusts the stepSize property.
         *
         * @method setTo
         * @param value {number} The _to_ value
         */
        Bounds.prototype.setTo = function (value) {
            this._to = value;
            this.updateSize();
            this.updateDirection();
        };
        /**
         * Gets the number of discrete steps within the bounds that value calculation will snap to.
         *
         * @method getNumSteps
         * @return {number} The number of steps
         */
        Bounds.prototype.getNumSteps = function () {
            return this._numSteps;
        };
        /**
         * Sets the number of discrete steps within the bounds that value calculation will snap to. If 0, this functionality is disabled.
         *
         * @method setNumSteps
         * @param value {number} The number of steps
         */
        Bounds.prototype.setNumSteps = function (value) {
            if (value < 0) {
                throw new Error("Value must be 0 or larger");
            }
            this._numSteps = value;
            if (value == 0) {
                this._stepSize = 0;
            }
            else {
                this._stepSize = this._size / this._numSteps;
            }
        };
        /**
         * Gets the size of one discrete step. Value calculation will snap to values of this step size. If 0, this functionality is disabled.
         *
         * @method getStepSize
         * @return {number} The step size
         */
        Bounds.prototype.getStepSize = function () {
            return this._stepSize;
        };
        /**
         * Sets the size of one discrete step. Value calculation will snap to values of this step size. If 0, this functionality is disabled.
         * If the size of the bounds is not divisible by the value, the value will be rounded.
         *
         * @method setStepSize
         * @return value {number} The step size
         */
        Bounds.prototype.setStepSize = function (value) {
            if (value < 0) {
                throw new Error("Value must be 0 or larger");
            }
            else if (value > this._size) {
                throw new Error("The step size cannot be larger than the size of the bounds");
            }
            if (value == 0) {
                this._numSteps = 0;
                this._stepSize = 0;
            }
            else {
                this._numSteps = Math.round(this._size / value);
                this._stepSize = this._size / this._numSteps;
            }
        };
        return Bounds;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Bounds;
});
