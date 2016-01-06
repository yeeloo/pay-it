define(["require", "exports", "lib/temple/config/configManagerInstance"], function (require, exports, configManagerInstance_1) {
    var config = {
        "environments": {
            "live": {
                "variables": {
                    "base": "{protocol}//clients.vellance.net/"
                },
                "urls": {
                    "api_url": { "url": "{base}api/flapi.php" },
                    "api_url_plain": "{base}api/flapi.php"
                },
                "properties": {
                    "facebook_appid": "123456789",
                    "linkedin_apikey": ""
                }
            },
            "staging": {
                "extends": "live",
                "variables": {
                    "base": "{protocol}//staging.vellance.net/"
                }
            },
            "development": {
                "extends": "staging",
                "variables": {
                    "base": "{protocol}//devmonks.vellance.net/"
                }
            },
            "local": {
                "extends": "development",
                "variables": {
                    "base": ""
                }
            }
        },
        "variables": {
            protocol: document.location.protocol,
            string: 'string',
            number: 12345,
            boolean_true: true,
            boolean_false: false,
            replace: '{string}{number}{boolean_true}{boolean_false}{custom_1}{custom_2}{custom_unknown}'
        },
        "urls": {
            "api_url": { "url": "{base}api/flapi.php" },
            "facebook_channelurl": { "url": "{base}channel.html" },
            replace: '{string}{number}{boolean_true}{boolean_false}{custom_1}{custom_2}{custom_unknown}'
        },
        "properties": {
            "defaultLocale": "en_GB",
            number: 12345,
            boolean_true: true,
            boolean_false: false
        }
    };
    describe('ConfigManager', function () {
        beforeEach(function () {
            configManagerInstance_1.default.init(JSON.parse(JSON.stringify(config)), 'development');
        });
        it('should return the correct environment', function () {
            expect(configManagerInstance_1.default.getEnvironment()).toBe('development');
        });
        it('should return the correct merged environment', function () {
            expect(configManagerInstance_1.default.getConfig()['extends']).toBe('staging');
        });
        it('should return the correct protocol var', function () {
            expect(configManagerInstance_1.default.getVariable('protocol')).toBe(document.location.protocol);
        });
        it('should return the correct base var with replaced variables', function () {
            expect(configManagerInstance_1.default.getVariable('base')).toBe(document.location.protocol + '//devmonks.vellance.net/');
        });
        it('should return the new base var', function () {
            configManagerInstance_1.default.setVariable('base', '{protocol}//test.com/');
            expect(configManagerInstance_1.default.getVariable('base')).toBe(document.location.protocol + '//test.com/');
        });
        it('should return the correct replace var with replaced variables', function () {
            expect(configManagerInstance_1.default.getVariable('replace')).toBe('string12345truefalse{custom_1}{custom_2}{custom_unknown}');
        });
        it('should return the correct replace var with replaced variables from getUrl', function () {
            expect(configManagerInstance_1.default.getURL('replace', { custom_1: 'c1', custom_2: 234 })).toBe('string12345truefalsec1234{custom_unknown}');
        });
        it('should return the correct defaultLocale property', function () {
            expect(configManagerInstance_1.default.getProperty('defaultLocale')).toBe('en_GB');
        });
        it('should return the correct facebook_appid property with replaced variables', function () {
            expect(configManagerInstance_1.default.getProperty('facebook_appid')).toBe('123456789');
        });
        it('should return the correct type', function () {
            expect(typeof configManagerInstance_1.default.getProperty('number')).toBe('number');
            expect(typeof configManagerInstance_1.default.getProperty('boolean_true')).toBe('boolean');
            expect(typeof configManagerInstance_1.default.getProperty('boolean_false')).toBe('boolean');
        });
        it('should return the correct api_url url as object', function () {
            expect(configManagerInstance_1.default.getURL('api_url')).toBe(document.location.protocol + '//devmonks.vellance.net/api/flapi.php');
        });
        it('should return the correct api_url url as string', function () {
            expect(configManagerInstance_1.default.getURL('api_url_plain')).toBe(document.location.protocol + '//devmonks.vellance.net/api/flapi.php');
        });
    });
});
