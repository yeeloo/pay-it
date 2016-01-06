define(["require", "exports", "lib/temple/geom/RectangleUtils"], function (require, exports, RectangleUtils_1) {
    describe('temple.geom.RectangleUtils::getLeft', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            expect(RectangleUtils_1.default.getLeft(rectangle)).toEqual(10);
        });
    });
    describe('temple.geom.RectangleUtils::getRight', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            expect(RectangleUtils_1.default.getRight(rectangle)).toEqual(90);
        });
    });
    describe('temple.geom.RectangleUtils::getTop', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            expect(RectangleUtils_1.default.getTop(rectangle)).toEqual(20);
        });
    });
    describe('temple.geom.RectangleUtils::getBottom', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            expect(RectangleUtils_1.default.getBottom(rectangle)).toEqual(80);
        });
    });
    describe('temple.geom.RectangleUtils::setLeft', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            RectangleUtils_1.default.setLeft(rectangle, 40);
            expect(rectangle.x).toEqual(40);
        });
    });
    describe('temple.geom.RectangleUtils::setTop', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            RectangleUtils_1.default.setTop(rectangle, 40);
            expect(rectangle.y).toEqual(40);
        });
    });
    describe('temple.geom.RectangleUtils::setRight', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            RectangleUtils_1.default.setRight(rectangle, 40);
            expect(rectangle.width).toEqual(30);
        });
    });
    describe('temple.geom.RectangleUtils::setBottom', function () {
        it('should be correct', function () {
            var rectangle = {
                x: 10,
                y: 20,
                width: 80,
                height: 60
            };
            RectangleUtils_1.default.setBottom(rectangle, 40);
            expect(rectangle.height).toEqual(20);
        });
    });
    describe('temple.geom.RectangleUtils::intersection', function () {
        it('should keep original', function () {
            var rectangle = {
                x: 0,
                y: 20,
                width: 100,
                height: 60
            };
            var toIntersect = {
                x: -10,
                y: -10,
                width: 260,
                height: 200
            };
            var rect = RectangleUtils_1.default.intersection(rectangle, toIntersect);
            expect(rect.x).toEqual(0);
            expect(rect.y).toEqual(20);
            expect(rect.width).toEqual(100);
            expect(rect.height).toEqual(60);
        });
        it('should get target', function () {
            var rectangle = {
                x: 0,
                y: 20,
                width: 100,
                height: 60
            };
            var toIntersect = {
                x: 30,
                y: 30,
                width: 10,
                height: 10
            };
            var rect = RectangleUtils_1.default.intersection(rectangle, toIntersect);
            expect(rect.x).toEqual(30);
            expect(rect.y).toEqual(30);
            expect(rect.width).toEqual(10);
            expect(rect.height).toEqual(10);
        });
        it('should get crop', function () {
            var rectangle = {
                x: 0,
                y: 20,
                width: 100,
                height: 60
            };
            var toIntersect = {
                x: 20,
                y: 0,
                width: 60,
                height: 100
            };
            var rect = RectangleUtils_1.default.intersection(rectangle, toIntersect);
            expect(rect.x).toEqual(20);
            expect(rect.y).toEqual(20);
            expect(rect.width).toEqual(60);
            expect(rect.height).toEqual(60);
        });
    });
});
