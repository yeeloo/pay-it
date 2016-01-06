define(["require", "exports"], function (require, exports) {
    /**
     * Global config file used by the {{#crossLink "app.config.ConfigManager"}}ConfigManager{{/crossLink}}
     *
     *	{
     *		"environments": {
     *			"live": {
     *				"variables": {
     *					"base": "{protocol}//clients.vellance.net/"
     *				},
     *				"urls": {
     *					"api": { "url": "{base}api/flapi.php" }
     *				},
     *				"properties": {
     *					"facebook_appid": "0123456789",
     *					"linkedin_apikey": ""
     *				}
     *			},
     *			"staging": {
     *				"extends": "live",
     *				"variables": {
     *					"base": "{protocol}//staging.vellance.net/"
     *				}
     *			},
     *			"development": {
     *				"extends": "staging",
     *				"variables": {
     *					"base": "{protocol}//devmonks.vellance.net/"
     *				}
     *			},
     *			"local": {
     *				"extends": "development",
     *				"variables": {
     *					"base": ""
     *				}
     *			}
     *		},
     *		"variables": {
     *			"protocol": document.location.protocol
     *		},
     *		"urls": {
     *			"api": { "url": "{base}api/flapi.php" },
     *			"facebook_channelurl": { "url": "{base}channel.html" }
     *		},
     *		"properties": {
     *			"defaultLocale": "en_GB"
     *		}
     *	}
     *
     * @namespace app.config
     * @class config
     */
    if (typeof window['DEBUG'] === 'undefined') {
        window['DEBUG'] = true;
    }
    if (typeof window['RELEASE'] === 'undefined') {
        window['RELEASE'] = false;
    }
    /**
     * @todo define
     * @attribute config
     */
    var config = {
        "environments": {
            "live": {
                "variables": {},
                "urls": {},
                "properties": {}
            },
            "local": {
                "extends": "live",
                "variables": {}
            }
        },
        "variables": {
            "protocol": document.location.protocol,
            "base": document.querySelector('meta[name=document-base]').getAttribute('content')
        },
        "urls": {
            "api": { "url": "{base}api" },
            "record": { "url": "data/record.json" },
            "payee": { "url": "data/payee.json" }
        },
        "properties": {
            "defaultLocale": "en_GB"
        }
    };
    /**
     *
     *
     * @attribute environment
     * @type string
     */
    var environment = 'live';
    var host = document.location.host;
    if (host.indexOf('mediamonks.local') != -1) {
        host = 'localhost';
    }
    switch (host.split(':').shift()) {
        case 'localhost':
            {
                environment = 'local';
                break;
            }
        default:
            {
                environment = 'live';
                break;
            }
    }
    var configMethod = {
        config: config,
        environment: environment
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = configMethod;
});
