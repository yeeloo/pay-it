define(["require", "exports", "lib/temple/utils/ui/ElementResizer"], function (require, exports, ElementResizer_1) {
    describe('temple.utils.ui.ElementResizer::getRect', function () {
        it('should align center', function () {
            var rect = ElementResizer_1.default.getRect(50, 80, ElementResizer_1.ScaleMode.ALIGN_ONLY, { x: 0, y: 0, width: 100, height: 100 }, 0.5, 0.5);
            expect(rect.x).toEqual(25);
            expect(rect.y).toEqual(10);
            expect(rect.width).toEqual(50);
            expect(rect.height).toEqual(80);
        });
        it('should align left top', function () {
            var rect = ElementResizer_1.default.getRect(50, 80, ElementResizer_1.ScaleMode.ALIGN_ONLY, { x: 0, y: 0, width: 100, height: 100 }, 0, 0);
            expect(rect.x).toEqual(0);
            expect(rect.y).toEqual(0);
            expect(rect.width).toEqual(50);
            expect(rect.height).toEqual(80);
        });
        it('should align bottom right', function () {
            var rect = ElementResizer_1.default.getRect(50, 80, ElementResizer_1.ScaleMode.ALIGN_ONLY, { x: 0, y: 0, width: 100, height: 100 }, 1, 1);
            expect(rect.x).toEqual(50);
            expect(rect.y).toEqual(20);
            expect(rect.width).toEqual(50);
            expect(rect.height).toEqual(80);
        });
        it('should align center with contain', function () {
            var rect = ElementResizer_1.default.getRect(50, 80, ElementResizer_1.ScaleMode.CONTAIN, { x: 0, y: 0, width: 100, height: 100 }, 0.5, 0.5);
            console.log(rect);
            expect(rect.x).toEqual(18.75);
            expect(rect.y).toEqual(0);
            expect(rect.width).toEqual(50 * 1.25);
            expect(rect.height).toEqual(100);
        });
        it('should align center with cover', function () {
            var rect = ElementResizer_1.default.getRect(50, 80, ElementResizer_1.ScaleMode.COVER, { x: 0, y: 0, width: 100, height: 100 }, 0.5, 0.5);
            console.log(rect);
            expect(rect.x).toEqual(0);
            expect(rect.y).toEqual(-30);
            expect(rect.width).toEqual(100);
            expect(rect.height).toEqual(160);
        });
        it('should align center with cover with maxwidth/height', function () {
            var rect = ElementResizer_1.default.getRect(50, 80, ElementResizer_1.ScaleMode.COVER, { x: 0, y: 0, width: 100, height: 100 }, 0.5, 0.5, 100, 100);
            console.log(rect);
            expect(rect.x).toEqual(18.75);
            expect(rect.y).toEqual(0);
            expect(rect.width).toEqual(50 * 1.25);
            expect(rect.height).toEqual(100);
        });
        it('should align center with cover with maxwidth/height as landscape', function () {
            var rect = ElementResizer_1.default.getRect(80, 50, ElementResizer_1.ScaleMode.COVER, { x: 0, y: 0, width: 100, height: 100 }, 0.5, 0.5, 100, 100);
            console.log(rect);
            expect(rect.x).toEqual(0);
            expect(rect.y).toEqual(18.75);
            expect(rect.width).toEqual(100);
            expect(rect.height).toEqual(50 * 1.25);
        });
    });
});
