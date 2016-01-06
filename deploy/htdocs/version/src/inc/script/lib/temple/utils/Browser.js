/**
 * @name Browser
 * @author Mient-jan Stelling
 * @description a replacement of the mootools Browser static class
 * @todo add type of device like iphone, tablet, andriod phone, tablet
 */
define(["require", "exports"], function (require, exports) {
    var Browser = (function () {
        var document = window.document;
        function parse(userAgent, platform) {
            var ua = userAgent.toLowerCase();
            platform = (platform ? platform.toLowerCase() : '');
            var UAArr = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];
            if (UAArr[1] == 'trident') {
                UAArr[1] = 'ie';
                if (UAArr[4])
                    UAArr[2] = UAArr[4];
            }
            else if (UAArr[1] == 'crios') {
                UAArr[1] = 'chrome';
            }
            platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0];
            if (platform == 'win') {
                platform = 'windows';
            }
            return {
                userAgent: userAgent,
                name: '' + ((UAArr[1] == 'version') ? UAArr[3] : UAArr[1]),
                version: parseFloat(((UAArr[1] == 'opera' && UAArr[4]) ? UAArr[4] : UAArr[2])),
                platform: '' + platform,
                isIPhone4Or4s: function () {
                    return platform == 'ios' && (window.screen.height == (960 / 2));
                }
            };
        }
        var Browser = parse(navigator.userAgent, navigator.platform);
        // ie11 fix
        if (Browser.name !== 'firefox' && Browser.name !== 'chrome' && Browser.name !== 'safari' && !window['ActiveXObject'] && Browser.name != 'ie') {
            Browser.name = 'ie';
            Browser.version = 11;
        }
        if (Browser.name == 'ie') {
            Browser.version = document['documentMode'];
        }
        Browser[Browser.name] = true;
        Browser[Browser.name + Browser.version] = true;
        Browser[Browser.platform] = true;
        return Browser;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Browser;
});
