import refdef from "def/ReferenceDefinitions";
import externals from "lib/externals";
import {default as ElementResizer, ScaleMode} from "lib/temple/utils/ui/ElementResizer";
import IRectangle from "lib/temple/geom/IRectangle";

describe('temple.utils.ui.ElementResizer::getRect', () => {

    it('should align center', () =>
    {
        var rect = ElementResizer.getRect(
            50,
            80,
            ScaleMode.ALIGN_ONLY,
            {x: 0, y: 0, width: 100, height: 100},
            0.5,
            0.5);

        expect(rect.x).toEqual(25);
        expect(rect.y).toEqual(10);
        expect(rect.width).toEqual(50);
        expect(rect.height).toEqual(80);
    });

    it('should align left top', () =>
    {
        var rect = ElementResizer.getRect(
            50,
            80,
            ScaleMode.ALIGN_ONLY,
            {x: 0, y: 0, width: 100, height: 100},
            0,
            0);

        expect(rect.x).toEqual(0);
        expect(rect.y).toEqual(0);
        expect(rect.width).toEqual(50);
        expect(rect.height).toEqual(80);
    });

    it('should align bottom right', () =>
    {
        var rect = ElementResizer.getRect(
            50,
            80,
            ScaleMode.ALIGN_ONLY,
            {x: 0, y: 0, width: 100, height: 100},
            1,
            1);

        expect(rect.x).toEqual(50);
        expect(rect.y).toEqual(20);
        expect(rect.width).toEqual(50);
        expect(rect.height).toEqual(80);
    });

    it('should align center with contain', () =>
    {
        var rect = ElementResizer.getRect(
            50,
            80,
            ScaleMode.CONTAIN,
            {x: 0, y: 0, width: 100, height: 100},
            0.5,
            0.5);

        console.log(rect);

        expect(rect.x).toEqual(18.75);
        expect(rect.y).toEqual(0);
        expect(rect.width).toEqual(50 * 1.25);
        expect(rect.height).toEqual(100);
    });


    it('should align center with cover', () =>
    {
        var rect = ElementResizer.getRect(
            50,
            80,
            ScaleMode.COVER,
            {x: 0, y: 0, width: 100, height: 100},
            0.5,
            0.5);

        console.log(rect);

        expect(rect.x).toEqual(0);
        expect(rect.y).toEqual(-30);
        expect(rect.width).toEqual(100);
        expect(rect.height).toEqual(160);
    });

    it('should align center with cover with maxwidth/height', () =>
    {
        var rect = ElementResizer.getRect(
            50,
            80,
            ScaleMode.COVER,
            {x: 0, y: 0, width: 100, height: 100},
            0.5,
            0.5,
            100,
            100
        );

        console.log(rect);

        expect(rect.x).toEqual(18.75);
        expect(rect.y).toEqual(0);
        expect(rect.width).toEqual(50 * 1.25);
        expect(rect.height).toEqual(100);
    });


    it('should align center with cover with maxwidth/height as landscape', () =>
    {
        var rect = ElementResizer.getRect(
            80,
            50,
            ScaleMode.COVER,
            {x: 0, y: 0, width: 100, height: 100},
            0.5,
            0.5,
            100,
            100
        );

        console.log(rect);

        expect(rect.x).toEqual(0);
        expect(rect.y).toEqual(18.75);
        expect(rect.width).toEqual(100);
        expect(rect.height).toEqual(50 * 1.25);
    });
});
