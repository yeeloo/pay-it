define(["require", "exports", "lib/polyfills/polyfills", "lib/gaia/core/BranchTools", "lib/gaia/core/SiteModel", "lib/gaia/assets/PageAsset"], function (require, exports, polyfills_1, BranchTools_1, SiteModel_1, PageAsset_1) {
    polyfills_1.default;
    var m = {
        "title": "Skeleton - Gaia - {page}",
        "routes": [],
        "config": {},
        "pages": [
            {
                "id": "index",
                "title": "index",
                "landing": false,
                "pages": [
                    {
                        "id": "home",
                        "title": "home",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    },
                    {
                        "id": "contact",
                        "title": "contact",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    },
                    {
                        "id": "detail",
                        "title": "detail",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    },
                    {
                        "id": "video",
                        "title": "video",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    }
                ]
            }
        ],
        "popups": [
            {
                "id": "popup1",
                "title": "popup1",
                "controller": "default",
                "viewModel": "default",
                "template": "default",
                "container": "index"
            },
            {
                "id": "popup2",
                "title": "popup2",
                "controller": "default",
                "viewModel": "default",
                "template": "default",
                "container": "main"
            },
            // deep popup example
            {
                "id": "takeover",
                "title": "takeover",
                "controller": "default",
                "viewModel": "default",
                "template": "default",
                "landing": false,
                "pages": [
                    {
                        "id": "about",
                        "title": "about",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default",
                        "type": "popup"
                    },
                    {
                        "id": "terms",
                        "title": "terms",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default",
                        "type": "popup"
                    }
                ]
            }
        ]
    };
    function setupModel() {
        var model = new SiteModel_1.default();
        model.load(m);
        return model;
    }
    describe('Gaia SiteModel', function () {
        var model = setupModel();
        it('should return the sitemodel', function () {
            expect(SiteModel_1.default.getSitemap()).toEqual(m);
        });
        it('should return the correct title', function () {
            expect(SiteModel_1.default.getTitle()).toBe("Skeleton - Gaia - {page}");
        });
        it('should return the base tree', function () {
            expect(SiteModel_1.default.getTree()).toEqual(jasmine.any(PageAsset_1.default));
        });
    });
    describe('BranchTools', function () {
        it('should return the correct page', function () {
            expect(BranchTools_1.default.getPage('').getBranch()).toEqual('index');
            expect(BranchTools_1.default.getPage('index').getBranch()).toEqual('index');
            expect(BranchTools_1.default.getPage('index/home').getBranch()).toEqual('index/home');
            expect(BranchTools_1.default.getPage('home').getBranch()).toEqual('index/home');
            expect(BranchTools_1.default.getPage('detail').getBranch()).toEqual('index/detail');
        });
        it('should return the correct validBranch', function () {
            expect(BranchTools_1.default.getValidBranch('random-value')).toEqual('index/home');
            expect(BranchTools_1.default.getValidBranch('index')).toEqual('index/home');
            expect(BranchTools_1.default.getValidBranch('home')).toEqual('index/home');
            expect(BranchTools_1.default.getValidBranch('detail/deeplink/that/shoud/be/stripped')).toEqual('index/detail');
            expect(BranchTools_1.default.getValidBranch('random-value', false)).toEqual('index');
            expect(BranchTools_1.default.getValidBranch('index', false)).toEqual('index');
        });
        it('should return the correct fullBranch', function () {
            expect(BranchTools_1.default.getFullBranch('')).toEqual('index/home');
            expect(BranchTools_1.default.getFullBranch('home')).toEqual('index/home');
            expect(BranchTools_1.default.getFullBranch('detail')).toEqual('index/detail');
        });
        it('should return a list of pages', function () {
            var pagesIndex = BranchTools_1.default.getPagesOfBranch('');
            expect(pagesIndex.length).toEqual(2);
            expect(pagesIndex).toContain(BranchTools_1.default.getPage('index'));
            expect(pagesIndex).toContain(BranchTools_1.default.getPage('home'));
            var pagesHome = BranchTools_1.default.getPagesOfBranch('home');
            expect(pagesHome.length).toEqual(2);
            expect(pagesHome).toContain(BranchTools_1.default.getPage('index'));
            expect(pagesHome).toContain(BranchTools_1.default.getPage('home'));
            var pagesDetail = BranchTools_1.default.getPagesOfBranch('index/detail');
            expect(pagesDetail.length).toEqual(2);
            expect(pagesDetail).toContain(BranchTools_1.default.getPage('index'));
            expect(pagesDetail).toContain(BranchTools_1.default.getPage('detail'));
        });
        it('should return the default child branch', function () {
            expect(BranchTools_1.default.getDefaultChildBranch('index')).toEqual('index/home');
            expect(BranchTools_1.default.getDefaultChildBranch('index/home')).toEqual('index/home');
            expect(BranchTools_1.default.getDefaultChildBranch('index/detail')).toEqual('index/detail');
        });
        it('should return the correct popup branch', function () {
            expect(BranchTools_1.default.getPopupBranch('popup1', 'index')).toEqual('index/popup1');
            expect(BranchTools_1.default.getPopupBranch('popup1', 'index/home')).toEqual('index/home/popup1');
            expect(BranchTools_1.default.getPopupBranch('popup1', 'index/home/popup1')).toEqual('index/home/popup1');
            expect(BranchTools_1.default.getPopupBranch('popup1', 'index/home/popup2')).toEqual('index/home/popup1');
            expect(BranchTools_1.default.getPopupBranch('popup1', 'index/home/takeover')).toEqual('index/home/popup1');
            expect(BranchTools_1.default.getPopupBranch('popup1', 'index/home/takeover/about')).toEqual('index/home/popup1');
            expect(BranchTools_1.default.getPopupBranch('takeover/about', 'index/home')).toEqual('index/home/takeover/about');
            expect(BranchTools_1.default.getPopupBranch('takeover/about', 'index/home/popup1')).toEqual('index/home/takeover/about');
            expect(BranchTools_1.default.getPopupBranch('takeover/about', 'index/home/takeover')).toEqual('index/home/takeover/about');
            expect(BranchTools_1.default.getPopupBranch('takeover/about', 'index/home/takeover/about')).toEqual('index/home/takeover/about');
            expect(BranchTools_1.default.getPopupBranch('takeover', 'index/home/popup1')).toEqual('index/home/takeover');
            expect(BranchTools_1.default.getPopupBranch('takeover', 'index/home/takeover')).toEqual('index/home/takeover');
            expect(BranchTools_1.default.getPopupBranch('takeover', 'index/home/takeover/about')).toEqual('index/home/takeover');
            expect(BranchTools_1.default.getPopupBranch('takeover', 'index/home/deeplink')).toEqual('index/home/takeover');
            expect(BranchTools_1.default.getPopupBranch('takeover', 'index/home/takeover/deeplink')).toEqual('index/home/takeover');
            expect(BranchTools_1.default.getPopupBranch('takeover', 'index/home/takeover/about/deeplink')).toEqual('index/home/takeover');
        });
    });
});
