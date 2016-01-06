define(["require", "exports", "lib/externals", "lib/polyfills/polyfills", "lib/gaia/router/GaiaRouter"], function (require, exports, externals, polyfills_1, GaiaRouter_1) {
    polyfills_1.default;
    externals;
    describe('GaiRouter', function () {
        var router;
        beforeEach(function () {
            router = new GaiaRouter_1.default(null);
            router.notFound('index/error-404');
            router.page('/', 'index/home');
            router.page('/home', 'index/home');
            router.page('/contact', 'index/contact');
            router.page('/news/:filter/:type?/:date?', 'index/news')
                .assert('filter', '^overview$')
                .assert('type', '^(all|video|photo|forum)$');
            //.children([
            //	router.childPage('/terms/:type?', 'terms'),
            //	router.childPage('/privacy/:category?', 'privacy')
            //]);
            router.page('/news/:filter/:query', 'index/news')
                .assert('filter', '^search$');
            router.page('/news/:filter/:tag', 'index/news')
                .assert('filter', '^tag$');
            router.page('/news(.*)', 'index/news')
                .spec('/news');
            router.page('/recipes/(?<filters>.+)/:page', 'index/recipes')
                .assert('page', '^\\d+$')
                .parse('page', function (page) {
                return +page;
            })
                .spec('/recipes/{filters}/{page}');
            router.page('/recipes2/:filters*/:page', 'index/recipes2')
                .assert('page', '^\\d+$')
                .parse('page', function (page) {
                return +page;
            })
                .parse('filters', function (filters) {
                return filters.substr(1);
            });
            router.page('/mexican-recipes(?<filters>(?:/[a-z][^/]*)*)(?:/(?<page>\\d+))?', 'index/mexican-recipes')
                .parse('filters', function (filters) {
                return filters.substr(1);
            })
                .parse('page', function (page) {
                return +page;
            })
                .spec('/mexican-recipes/{filters}/{page}');
            router.page('/landing-test', 'index/landing')
                .redirectOnLanding('/contact');
        });
        // RESOLVE
        // TODO: resolve to async!
        //it('should not resolve static route /foo/bar', () =>
        //{
        //	expect(router.resolvePage('/foo/bar')).toEqual(new RouteResultItem([{branch: 'index/error-404', deeplink: {}}], '/foo/bar'));
        //});
        //
        //it('should resolve static route /', () =>
        //{
        //	expect(router.resolvePage('/')).toEqual(new RouteResultItem([{branch: 'index/home', deeplink: {}}], '/'));
        //});
        //
        //it('should resolve static route /home', () =>
        //{
        //	expect(router.resolvePage('/home')).toEqual(new RouteResultItem([{branch: 'index/home', deeplink: {}}], '/home'));
        //});
        //
        //it('should resolve static route /contact', () =>
        //{
        //	expect(router.resolvePage('/contact')).toEqual(new RouteResultItem([{branch: 'index/contact', deeplink: {}}], '/contact'));
        //});
        //
        //it('should resolve static route /news', () =>
        //{
        //	expect(router.resolvePage('/news')).toEqual(new RouteResultItem([{branch: 'index/news', deeplink: {}}], '/news'));
        //});
        //
        //it('should resolve dynamic route /news/overview/video', () =>
        //{
        //	expect(router.resolvePage('/news/overview/video')).toEqual(new RouteResultItem([{branch: 'index/news', deeplink: {'filter': 'overview', 'type': 'video'}}], '/news/overview/video'));
        //});
        //
        //it('should resolve dynamic route /news/overview/video/2014-01-19', () =>
        //{
        //	expect(router.resolvePage('/news/overview/video/2014-01-19')).toEqual(new RouteResultItem([{branch: 'index/news', deeplink: {'filter': 'overview', 'type': 'video', 'date' : '2014-01-19'}}], '/news/overview/video/2014-01-19'));
        //});
        //
        //it('should resolve dynamic route /news/search/test+query', () =>
        //{
        //	expect(router.resolvePage('/news/search/test+query')).toEqual(new RouteResultItem([{branch: 'index/news', deeplink: {'filter': 'search', 'query': 'test+query'}}], '/news/search/test+query'));
        //});
        //
        //it('should resolve invalid dynamic route /news/search to /news', () =>
        //{
        //	expect(router.resolvePage('/news/search')).toEqual(new RouteResultItem([{branch: 'index/news', deeplink: {}}], '/news/search'));
        //});
        //
        //it('should resolve dynamic route /news/tag/tagname', () =>
        //{
        //	expect(router.resolvePage('/news/tag/tagname')).toEqual(new RouteResultItem([{branch: 'index/news', deeplink: {'filter': 'tag', 'tag': 'tagname'}}], '/news/tag/tagname'));
        //});
        //
        //it('should resolve dynamic route /recipes with greedy filters', () =>
        //{
        //	expect(router.resolvePage('/recipes/filter1/filter2/12')).toEqual(new RouteResultItem([{branch: 'index/recipes', deeplink: {'filters': 'filter1/filter2', 'page': 12}}], '/recipes/filter1/filter2/12'));
        //});
        //
        //it('should resolve dynamic route /recipes2 with greedy named group', () =>
        //{
        //	expect(router.resolvePage('/recipes2/filter1/filter2/12')).toEqual(new RouteResultItem([{branch: 'index/recipes2', deeplink: {'filters': 'filter1/filter2', 'page': 12}}], '/recipes2/filter1/filter2/12'));
        //});
        //
        //it('should resolve regex route /mexican-recipes with page', () =>
        //{
        //	expect(router.resolvePage('/mexican-recipes/filter1/filter2/12')).toEqual(new RouteResultItem([{branch: 'index/mexican-recipes', deeplink: {'filters': 'filter1/filter2', 'page': 12}}], '/mexican-recipes/filter1/filter2/12'));
        //});
        //
        //it('should resolve dynamic route /mexican-recipes without page', () =>
        //{
        //	expect(router.resolvePage('/mexican-recipes/filter1/filter2')).toEqual(new RouteResultItem([{branch: 'index/mexican-recipes', deeplink: {'filters': 'filter1/filter2', 'page': undefined}}], '/mexican-recipes/filter1/filter2'));
        //});
        //
        //// not implemented yet
        //xit('should resolve child-page terms', () =>
        //{
        //	expect(router.resolvePage('/news/overview/video/2014-01-19/terms/foo-bar')).toEqual(new RouteResultItem([
        //		{branch: 'index/news/terms', deeplink: {'type': 'foo-bar'}},
        //		{branch: 'index/news', deeplink: {'filter': 'overview', 'type': 'video', 'date' : '2014-01-19'}}
        //	]));
        //});
        //
        //it('should resolve deeplink route normally', () =>
        //{
        //	expect(router.resolvePage('/landing-test', true, false)).toEqual(new RouteResultItem([{branch: 'index/landing', deeplink: {}}], '/landing-test'));
        //});
        //it('should resolve deeplink route normally on landing to redirect', () =>
        //{
        //	expect(router.resolvePage('/landing-test', true, true)).toEqual(new RouteResultItem([{branch: 'index/contact', deeplink: {}}], '/contact'));
        //});
        // ASSEMBLE
        it('should not assemble index/home with deeplink', function () {
            expect(router.assemble('index/home', { foo: 'bar' })).toEqual(null);
        });
        it('should assemble index/home', function () {
            expect(router.assemble('index/home')).toEqual('/');
        });
        it('should assemble index/contact', function () {
            expect(router.assemble('index/contact')).toEqual('/contact');
        });
        it('should assemble index/news', function () {
            expect(router.assemble('index/news')).toEqual('/news');
        });
        it('should assemble index/news/tag', function () {
            expect(router.assemble('index/news', { filter: 'tag', tag: 'tag+name' })).toEqual('/news/tag/tag+name');
        });
        it('should assemble index/news/search', function () {
            expect(router.assemble('index/news', { filter: 'search', query: 'search+query' })).toEqual('/news/search/search+query');
        });
        it('should assemble index/news/overview/video/2014-09-12', function () {
            expect(router.assemble('index/news', { filter: 'overview', type: 'video', date: '2014-09-12' })).toEqual('/news/overview/video/2014-09-12');
        });
        it('should assemble index/news/overview/video with optional date', function () {
            expect(router.assemble('index/news', { filter: 'overview', type: 'video' })).toEqual('/news/overview/video');
        });
        it('should assemble index/news/overview with optional type and date', function () {
            expect(router.assemble('index/news', { filter: 'overview' })).toEqual('/news/overview');
        });
        it('should assemble index/recipes with filters and page', function () {
            expect(router.assemble('index/recipes', { filters: ['filter1', 'filter2'].join('/'), page: 0 })).toEqual('/recipes/filter1/filter2/0');
        });
        it('should assemble index/recipes2 with filters and page', function () {
            expect(router.assemble('index/recipes2', { filters: ['filter1', 'filter2'].join('/'), page: 0 })).toEqual('/recipes2/filter1/filter2/0');
        });
        it('should assemble index/mexican-recipes with filters and page', function () {
            expect(router.assemble('index/mexican-recipes', { filters: ['filter1', 'filter2'].join('/'), page: 0 })).toEqual('/mexican-recipes/filter1/filter2/0');
        });
        it('should assemble index/mexican-recipes with filters and page', function () {
            expect(router.assemble('index/mexican-recipes', { filters: ['filter1', 'filter2'].join('/') })).toEqual('/mexican-recipes/filter1/filter2');
        });
        it('should assemble index/mexican-recipes with filters and page', function () {
            expect(router.assemble('index/mexican-recipes', { filters: [].join('/') })).toEqual('/mexican-recipes/');
        });
        it('should assemble index/mexican-recipes with filters and page', function () {
            expect(router.assemble('index/mexican-recipes', {})).toEqual('/mexican-recipes');
        });
        // todo branch with deeplink included instead of object
        // index/mexican-recipes/filter/1 to mexican-recipes/filter/1
    });
});
