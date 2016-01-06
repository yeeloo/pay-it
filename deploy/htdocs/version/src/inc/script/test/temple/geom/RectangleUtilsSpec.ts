import refdef from "def/ReferenceDefinitions";
import externals from "lib/externals";
import RectangleUtils from "lib/temple/geom/RectangleUtils";
import IRectangle from "lib/temple/geom/IRectangle";

describe('temple.geom.RectangleUtils::getLeft', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        expect(RectangleUtils.getLeft(rectangle)).toEqual(10);
    });
});

describe('temple.geom.RectangleUtils::getRight', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        expect(RectangleUtils.getRight(rectangle)).toEqual(90);
    });
});

describe('temple.geom.RectangleUtils::getTop', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        expect(RectangleUtils.getTop(rectangle)).toEqual(20);
    });
});

describe('temple.geom.RectangleUtils::getBottom', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        expect(RectangleUtils.getBottom(rectangle)).toEqual(80);
    });
});

describe('temple.geom.RectangleUtils::setLeft', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        RectangleUtils.setLeft(rectangle, 40);

        expect(rectangle.x).toEqual(40);
    });
});

describe('temple.geom.RectangleUtils::setTop', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        RectangleUtils.setTop(rectangle, 40);

        expect(rectangle.y).toEqual(40);
    });
});

describe('temple.geom.RectangleUtils::setRight', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        RectangleUtils.setRight(rectangle, 40);

        expect(rectangle.width).toEqual(30);
    });
});

describe('temple.geom.RectangleUtils::setBottom', () =>
{
    it('should be correct', () =>
    {
        var rectangle:IRectangle = {
            x: 10,
            y: 20,
            width: 80,
            height: 60
        };

        RectangleUtils.setBottom(rectangle, 40);

        expect(rectangle.height).toEqual(20);
    });
});

describe('temple.geom.RectangleUtils::intersection', () =>
{
    it('should keep original', () =>
    {
        var rectangle:IRectangle = {
            x: 0,
            y: 20,
            width: 100,
            height: 60
        };

        var toIntersect:IRectangle = {
            x: -10,
            y: -10,
            width: 260,
            height: 200
        };


        var rect = RectangleUtils.intersection(rectangle, toIntersect);

        expect(rect.x).toEqual(0);
        expect(rect.y).toEqual(20);
        expect(rect.width).toEqual(100);
        expect(rect.height).toEqual(60);
    });

    it('should get target', () =>
    {
        var rectangle:IRectangle = {
            x: 0,
            y: 20,
            width: 100,
            height: 60
        };

        var toIntersect:IRectangle = {
            x: 30,
            y: 30,
            width: 10,
            height: 10
        };


        var rect = RectangleUtils.intersection(rectangle, toIntersect);

        expect(rect.x).toEqual(30);
        expect(rect.y).toEqual(30);
        expect(rect.width).toEqual(10);
        expect(rect.height).toEqual(10);
    });

    it('should get crop', () =>
    {
        var rectangle:IRectangle = {
            x: 0,
            y: 20,
            width: 100,
            height: 60
        };

        var toIntersect:IRectangle = {
            x: 20,
            y: 0,
            width: 60,
            height: 100
        };


        var rect = RectangleUtils.intersection(rectangle, toIntersect);

        expect(rect.x).toEqual(20);
        expect(rect.y).toEqual(20);
        expect(rect.width).toEqual(60);
        expect(rect.height).toEqual(60);
    });
});
