define(["require", "exports"], function (require, exports) {
    var RectangleUtils = (function () {
        function RectangleUtils() {
        }
        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         *
         * @method contains
         * @param {IRectangle} rectangle
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         */
        RectangleUtils.contains = function (rectangle, x, y) {
            return rectangle.x <= x && rectangle.x + rectangle.width >= x &&
                rectangle.y <= y && rectangle.y + rectangle.height >= y;
        };
        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         *
         * @method containsPoint
         * @param {IRectangle} rectangle
         * @param {IPoint} point
         * @returns {boolean}
         */
        RectangleUtils.containsPoint = function (rectangle, point) {
            return RectangleUtils.contains(rectangle, point.x, point.y);
        };
        /**
         * Adjust the rectangle so it contains the x and y
         *
         * @method fit
         * @param {IRectangle} rectangle
         * @param {number} x
         * @param {number} y
         */
        RectangleUtils.fit = function (rectangle, x, y) {
            if (x < rectangle.x) {
                rectangle.width += rectangle.x - x;
                rectangle.x = x;
            }
            else if (x > rectangle.x + rectangle.width) {
                rectangle.width = x - rectangle.x;
            }
            if (y < rectangle.y) {
                rectangle.height += rectangle.y - y;
                rectangle.y = y;
            }
            else if (y > rectangle.y + rectangle.height) {
                rectangle.height = y - rectangle.y;
            }
        };
        /**
         * Adjust the rectangle so it contains the point
         *
         * @method fitPoint
         * @param {IRectangle} rectangle
         * @param {IPoint} point
         */
        RectangleUtils.fitPoint = function (rectangle, point) {
            RectangleUtils.fit(rectangle, point.x, point.y);
        };
        /**
         * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
         */
        //	public static containsRect(rectangle:IRectangle, rect:IRectangle):boolean
        //	{
        //	}
        /**
         * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
         */
        //	public static copyFrom(rectangle:IRectangle, sourceRect:IRectangle):void
        /**
         * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
         *
         * @method equals
         * @param {IRectangle} rectangle
         * @param {IRectangle} toCompare
         * @returns {boolean}
         */
        RectangleUtils.equals = function (rectangle, toCompare) {
            return rectangle.x == toCompare.x && rectangle.y == toCompare.y && rectangle.width == toCompare.width && rectangle.height == toCompare.height;
        };
        /**
         * Increases the size of the Rectangle object by the specified amounts, in pixels. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
         *
         * @method inflate
         * @param {IRectangle} rectangle
         * @param {number} dx
         * @param {number} dy
         */
        RectangleUtils.inflate = function (rectangle, dx, dy) {
            rectangle.x -= .5 * dx;
            rectangle.y -= .5 * dy;
            rectangle.width += dx;
            rectangle.height += dy;
        };
        /**
         * Increases the size of the Rectangle object.
         *
         * @method inflate
         * @param {IRectangle} rectangle
         * @param {IPoint} point
         */
        RectangleUtils.inflatePoint = function (rectangle, point) {
            RectangleUtils.inflate(rectangle, point.x, point.y);
        };
        /**
         * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object.
         */
        RectangleUtils.intersection = function (rectangle, toIntersect) {
            var rect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            RectangleUtils.setLeft(rect, RectangleUtils.getLeft(toIntersect) > RectangleUtils.getLeft(rectangle) ? RectangleUtils.getLeft(toIntersect) : RectangleUtils.getLeft(rectangle));
            RectangleUtils.setTop(rect, RectangleUtils.getTop(toIntersect) > RectangleUtils.getTop(rectangle) ? RectangleUtils.getTop(toIntersect) : RectangleUtils.getTop(rectangle));
            RectangleUtils.setRight(rect, RectangleUtils.getRight(toIntersect) < RectangleUtils.getRight(rectangle) ? RectangleUtils.getRight(toIntersect) : RectangleUtils.getRight(rectangle));
            RectangleUtils.setBottom(rect, RectangleUtils.getBottom(toIntersect) < RectangleUtils.getBottom(rectangle) ? RectangleUtils.getBottom(toIntersect) : RectangleUtils.getBottom(rectangle));
            return rect;
        };
        /**
         * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
         */
        //	public static intersects(rectangle:IRectangle, toIntersect:IRectangle):boolean
        /**
         * Determines whether or not this Rectangle object is empty.
         */
        //	public static isEmpty(rectangle:IRectangle):boolean
        /**
         * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
         */
        //	public static offset(rectangle:IRectangle, dx:number, dy:number):void
        /**
         * Adjusts the location of the Rectangle object using a Point object as a parameter.
         */
        //	public static offsetPoint(rectangle:IRectangle, point:IPoint):void
        /**
         * Sets all of the Rectangle object's properties to 0.
         */
        //	public static setEmpty():void
        /**
         * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
         *
         * @method union
         * @param {IRectangle} rectangle
         * @param {IRectangle} toUnion
         * @param {IRectangle} unioned
         * @returns {IRectangle}
         */
        RectangleUtils.union = function (rectangle, toUnion, unioned) {
            var x = Math.min(rectangle.x, toUnion.x);
            var y = Math.min(rectangle.y, toUnion.y);
            var width = Math.max(rectangle.x + rectangle.width, toUnion.x + toUnion.width) - x;
            var height = Math.max(rectangle.y + rectangle.height, toUnion.y + toUnion.height) - y;
            unioned = unioned || new rectangle.constructor();
            unioned.x = x;
            unioned.y = y;
            unioned.width = width;
            unioned.height = height;
            return unioned;
        };
        /**
         * Return the center point of a rectangle
         *
         * @method getCenter
         * @param {IRectangle} rectangle
         * @returns {IPoint}
         */
        RectangleUtils.getCenter = function (rectangle) {
            return { x: rectangle.x + .5 * rectangle.width, y: rectangle.y + .5 * rectangle.height };
        };
        //// CONVENIENCE METHODS FOR TOP/LEFT/RIGHT/BOTTOM
        RectangleUtils.getTop = function (rectangle) {
            return rectangle.y;
        };
        RectangleUtils.setTop = function (rectangle, top) {
            var diff = top - rectangle.y;
            rectangle.y += diff;
            rectangle.height -= diff;
        };
        RectangleUtils.getLeft = function (rectangle) {
            return rectangle.x;
        };
        RectangleUtils.setLeft = function (rectangle, left) {
            var diff = left - rectangle.x;
            rectangle.x += diff;
            rectangle.width -= diff;
        };
        RectangleUtils.getBottom = function (rectangle) {
            return rectangle.y + rectangle.height;
        };
        RectangleUtils.setBottom = function (rectangle, bottom) {
            rectangle.height = bottom - rectangle.y;
        };
        RectangleUtils.getRight = function (rectangle) {
            return rectangle.x + rectangle.width;
        };
        RectangleUtils.setRight = function (rectangle, right) {
            rectangle.width = right - rectangle.x;
        };
        RectangleUtils.toString = function (rectangle) {
            return "[Rectangle(x=" + rectangle.x + ", left=" + RectangleUtils.getLeft(rectangle) + ", y=" + rectangle.y + ", top=" + RectangleUtils.getTop(rectangle) + ", width=" + rectangle.width + ", right=" + RectangleUtils.getRight(rectangle) + ", height=" + rectangle.height + ", bottom=" + RectangleUtils.getBottom(rectangle) + ")]";
        };
        return RectangleUtils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RectangleUtils;
});
