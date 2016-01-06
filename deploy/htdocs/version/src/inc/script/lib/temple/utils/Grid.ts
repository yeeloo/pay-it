
export interface GridPoint {
    x:number;
    y:number;
}

export interface GridItem {
    position:GridPoint;
    width:number;
    height:number;
}


/**
 * @module Temple
 * @namespace temple.utils
 * @class Grid
 *
 * @author Arthur Dam <arthur@mediamonks.com>
 * @version 0.1
 * @copyright MediaMonks B.V. 2014
 */
export class Grid
{
    private _grid:number[];
    private _width:number;
    private _height:number;

    /**
     * Places arbitrary items within a grid of a given size.
     *
     * @class Grid
     * @constructor
     */
    constructor() { }

    /**
     * Initiates grid object.
     *
     * @method alloc
     * @param {number} mx Amount of columns of the grid.
     * @param {number} my Amount of rows of the grid.
     * @throws Will throw error if size is invalid.
     */
    public alloc(mx:number, my:number = 1):void
    {
        if(mx <= 0 || my <= 0) throw new Error('size must be larger than 0');

        this._width = mx;
        this._height = my;
        this._grid = [];

        for(var i = 0; i < mx * my; ++i)
        {
            this._grid.push(0);
        }
    }

    /**
     * Appends new row to grid item.
     *
     * @method append
     */
    private append():void
    {
        ++this._height;

        for(var i = 0; i < this._width; ++i)
        {
            this._grid.push(0);
        }
    }

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
    private sum(x:number, y:number, w:number, h:number):number
    {
        var out:number = 0;

        for(var ix:number = x; ix < x + w; ++ix)
        {
            for(var iy:number = y; iy < y + h; ++iy)
            {
                out += this._grid[(iy * this._width) + ix];
            }
        }

        return out;
    }

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
    private set(x:number, y:number, w:number, h:number):void
    {
        for(var ix:number = x; ix < x + w; ++ix)
        {
            for(var iy:number = y; iy < y + h; ++iy)
            {
                this._grid[(iy * this._width) + ix] = 1;
            }
        }
    }

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
    public clear(x:number, y:number, w:number, h:number):void
    {
        for(var ix:number = x; ix < x + w; ++ix)
        {
            for(var iy:number = y; iy < y + h; ++iy)
            {
                this._grid[(iy * this._width) + ix] = 0;
            }
        }
    }

    /**
     * Converts an index to a GridPoint.
     *
     * @method convert
     * @param {number} index Absolute index within the grid.
     * @returns {GridPoint}
     */
    private convert(index:number):GridPoint
    {
        return {x: index % this._width, y: ~~(index / this._width)};
    }

    /**
     * Finds an empty place in the grid and returns it.
     *
     * @method add
     * @param {number} width Width of the item.
     * @param {number} height Height of the item.
     * @returns {GridItem}
     * @throws Will throw error if size is invalid.
     */
    public add(width:number, height:number):GridItem
    {
        if(width <= 0 || height <= 0) throw new Error('size must be larger than 0');

        var found:boolean = false;
        while(found === false)
        {
            for(var i = 0; i < this._grid.length; ++i)
            {
                var position:GridPoint = this.convert(i);

                if(position.x + width > this._width)
                {
                    continue;
                }

                if(this.sum(position.x, position.y, width, height) === 0)
                {
                    found = true;
                    this.set(position.x, position.y, width, height);
                    return {position: position, width: width, height: height};
                }
            }

            this.append();
        }
    }

    /**
     * Gives the amount of items the grid is high.
     *
     * @method height
     * @returns {number}
     */
    public height():number
    {
        for(var iy:number = this._height; iy >= 0; --iy)
        {
            if(this.sum(0, iy, this._width, 1) === 0) return iy;
        }

        return this._height;
    }

    /**
     * Gives the amount of items the grid is wide.
     *
     * @method width
     * @returns {number}
     */
    public width():number
    {
        return this._width;
    }
}