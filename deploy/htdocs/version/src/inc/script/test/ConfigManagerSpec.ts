import refdef from "def/ReferenceDefinitions";
import externals from "lib/externals";

//import config from "app/config/config";
import configManagerInstance from "lib/temple/config/configManagerInstance";

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

describe('ConfigManager', () =>
{
	beforeEach(function()
	{
		configManagerInstance.init(JSON.parse(JSON.stringify(config)),'development');
	});

	it('should return the correct environment', () =>
	{
		expect(configManagerInstance.getEnvironment()).toBe('development');
	});

	it('should return the correct merged environment', () =>
	{
		expect(configManagerInstance.getConfig()['extends']).toBe('staging');
	});

	it('should return the correct protocol var', () =>
	{
		expect(configManagerInstance.getVariable('protocol')).toBe(document.location.protocol);
	});
	it('should return the correct base var with replaced variables', () =>
	{
		expect(configManagerInstance.getVariable('base')).toBe(document.location.protocol + '//devmonks.vellance.net/');
	});
	it('should return the new base var', () =>
	{
		configManagerInstance.setVariable('base', '{protocol}//test.com/');
		expect(configManagerInstance.getVariable('base')).toBe(document.location.protocol + '//test.com/');
	});
	it('should return the correct replace var with replaced variables', () =>
	{
		expect(configManagerInstance.getVariable('replace')).toBe('string12345truefalse{custom_1}{custom_2}{custom_unknown}');
	});
	it('should return the correct replace var with replaced variables from getUrl', () =>
	{
		expect(configManagerInstance.getURL('replace', {custom_1: 'c1', custom_2: 234})).toBe('string12345truefalsec1234{custom_unknown}');
	});

	it('should return the correct defaultLocale property', () =>
	{
		expect(configManagerInstance.getProperty('defaultLocale')).toBe('en_GB');
	});
	it('should return the correct facebook_appid property with replaced variables', () =>
	{
		expect(configManagerInstance.getProperty('facebook_appid')).toBe('123456789');
	});

	it('should return the correct type', () =>
	{
		expect(typeof configManagerInstance.getProperty('number')).toBe('number');
		expect(typeof configManagerInstance.getProperty('boolean_true')).toBe('boolean');
		expect(typeof configManagerInstance.getProperty('boolean_false')).toBe('boolean');
	});

	it('should return the correct api_url url as object', () =>
	{
		expect(configManagerInstance.getURL('api_url')).toBe(document.location.protocol + '//devmonks.vellance.net/api/flapi.php');
	});

	it('should return the correct api_url url as string', () =>
	{
		expect(configManagerInstance.getURL('api_url_plain')).toBe(document.location.protocol + '//devmonks.vellance.net/api/flapi.php');
	});
});