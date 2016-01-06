define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.utils
     * @class Grid
     *
     * @author Arthur Dam <arthur@mediamonks.com>
     * @version 0.1
     * @copyright MediaMonks B.V. 2014
     */
    var Grid = (function () {
        /**
         * Places arbitrary items within a grid of a given size.
         *
         * @class Grid
         * @constructor
         */
        function Grid() {
        }
        /**
         * Initiates grid object.
         *
         * @method alloc
         * @param {number} mx Amount of columns of the grid.
         * @param {number} my Amount of rows of the grid.
         * @throws Will throw error if size is invalid.
         */
        Grid.prototype.alloc = function (mx, my) {
            if (my === void 0) { my = 1; }
            if (mx <= 0 || my <= 0)
                throw new Error('size must be larger than 0');
            this._width = mx;
            this._height = my;
            this._grid = [];
            for (var i = 0; i < mx * my; ++i) {
                this._grid.push(0);
            }
        };
        /**
         * Appends new row to grid item.
         *
         * @method append
         */
        Grid.prototype.append = function () {
            ++this._height;
            for (var i = 0; i < this._width; ++i) {
                this._grid.push(0);
            }
        };
        /**
         * Calculates the sum of a given matrix within the grid.
         *
         *
         * @method sum
         * @param {number} x X position of the matrix.
         * @param {number} y Y position of the matrix.
         * @param {number} w Width of the matrix.
         * @param {number} h Height of the matrix.
         * @returns {number}
         *
         * @private
         */
        Grid.prototype.sum = function (x, y, w, h) {
            var out = 0;
            for (var ix = x; ix < x + w; ++ix) {
                for (var iy = y; iy < y + h; ++iy) {
                    out += this._grid[(iy * this._width) + ix];
                }
            }
            return out;
        };
        /**
         * Sets a number of grid positions to be set.
         *
         * @method set
         * @param {number} x X position of the matrix.
         * @param {number} y Y position of the matrix.
         * @param {number} w Width of the matrix.
         * @param {number} h Height of the matrix.
         * @returns {number}
         */
        Grid.prototype.set = function (x, y, w, h) {
            for (var ix = x; ix < x + w; ++ix) {
                for (var iy = y; iy < y + h; ++iy) {
                    this._grid[(iy * this._width) + ix] = 1;
                }
            }
        };
        /**
         * Frees up a matrix within the grid.
         *
         * @method clear
         * @param {number} x X position of the matrix.
         * @param {number} y Y position of the matrix.
         * @param {number} w Width of the matrix.
         * @param {number} h Height of the matrix.
         * @returns {void}
         */
        Grid.prototype.clear = function (x, y, w, h) {
            for (var ix = x; ix < x + w; ++ix) {
                for (var iy = y; iy < y + h; ++iy) {
                    this._grid[(iy * this._width) + ix] = 0;
                }
            }
        };
        /**
         * Converts an index to a GridPoint.
         *
         * @method convert
         * @param {number} index Absolute index within the grid.
         * @returns {GridPoint}
         */
        Grid.prototype.convert = function (index) {
            return { x: index % this._width, y: ~~(index / this._width) };
        };
        /**
         * Finds an empty place in the grid and returns it.
         *
         * @method add
         * @param {number} width Width of the item.
         * @param {number} height Height of the item.
         * @returns {GridItem}
         * @throws Will throw error if size is invalid.
         */
        Grid.prototype.add = function (width, height) {
            if (width <= 0 || height <= 0)
                throw new Error('size must be larger than 0');
            var found = false;
            while (found === false) {
                for (var i = 0; i < this._grid.length; ++i) {
                    var position = this.convert(i);
                    if (position.x + width > this._width) {
                        continue;
                    }
                    if (this.sum(position.x, position.y, width, height) === 0) {
                        found = true;
                        this.set(position.x, position.y, width, height);
                        return { position: position, width: width, height: height };
                    }
                }
                this.append();
            }
        };
        /**
         * Gives the amount of items the grid is high.
         *
         * @method height
         * @returns {number}
         */
        Grid.prototype.height = function () {
            for (var iy = this._height; iy >= 0; --iy) {
                if (this.sum(0, iy, this._width, 1) === 0)
                    return iy;
            }
            return this._height;
        };
        /**
         * Gives the amount of items the grid is wide.
         *
         * @method width
         * @returns {number}
         */
        Grid.prototype.width = function () {
            return this._width;
        };
        return Grid;
    })();
    exports.Grid = Grid;
});
