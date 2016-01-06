define(["require", "exports"], function (require, exports) {
    /**
     * @namespace app.config
     * @class ConfigManager
     */
    var ConfigManager = (function () {
        function ConfigManager() {
            this._varRegExp = /\{([^}]+)\}/gi;
        }
        /**
         *
         * @todo define config
         * @method init
         * @param {IConfig} config
         * @param {string} environment
         */
        ConfigManager.prototype.init = function (config, environment) {
            this._config = config;
            // set default groups on base object, so the functions below will never fail
            this._config.variables = this._config.variables || {};
            this._config.urls = this._config.urls || {};
            this._config.properties = this._config.properties || {};
            // sets the detected environment
            if (environment !== void 0) {
                this.setEnvironment(environment);
            }
            else {
                this.render();
            }
        };
        /**
         * Gets the current environment
         *
         * @method getEnvironment
         * @returns {string}
         */
        ConfigManager.prototype.getEnvironment = function () {
            return this._environment;
        };
        /**
         * Sets the new environment, causes a re-render of the config
         *
         * @method setEnvironment
         * @param {string} environment
         * @return {void}
         */
        ConfigManager.prototype.setEnvironment = function (environment) {
            if (this.hasEnvironment(environment)) {
                this._environment = environment;
            }
            else {
                throw new Error('Environment "' + environment + '" is not defined');
            }
            this.render();
        };
        /**
         * Checks if we have a certain environment
         *
         * @method hasEnvironment
         * @param {string} environment
         * @returns {boolean}
         */
        ConfigManager.prototype.hasEnvironment = function (environment) {
            return this._config.environments && this._config.environments.hasOwnProperty(environment);
        };
        /**
         * Get a URL by it name.
         * This method throws an error if a URL with the provided name doesn't exists.
         *
         * @method getURL
         * @param {string} name
         * @param {any} variables
         * @returns {string}
         */
        ConfigManager.prototype.getURL = function (name, variables) {
            if (!this.hasURL(name)) {
                throw new Error('URL "' + name + '" does not exist');
            }
            var url = this._parsedConfig.urls[name].url;
            if (variables) {
                url = this.replaceVars(url, variables);
            }
            return url;
        };
        /**
         * Gets a certain URL Configuration.
         * This method throws an error if a URL with the provided name doesn't exists.
         *
         * @method getURLConfig
         * @param {string} name
         * @returns {app.config.IURLData}
         */
        ConfigManager.prototype.getURLConfig = function (name) {
            if (!this.hasURL(name)) {
                throw new Error('URL "' + name + '" does not exist');
            }
            return this._parsedConfig.urls[name];
        };
        ConfigManager.prototype.openURL = function (name, variables) {
            if (!this.hasURL(name)) {
                throw new Error('URL "' + name + '" does not exist');
            }
            var configURL = this._parsedConfig.urls[name];
            var url = configURL.url;
            if (variables) {
                if (typeof variables == "function") {
                    url = variables(url);
                }
                else {
                    url = this.replaceVars(url, variables);
                }
            }
            window.open(url, configURL.target, configURL.features);
        };
        /**
         * Checks if a certain url exists.
         *
         * @method hasURL
         * @param {string} name
         * @returns {boolean}
         */
        ConfigManager.prototype.hasURL = function (name) {
            return this._parsedConfig.urls.hasOwnProperty(name);
        };
        /**
         * Gets a certain var
         *
         * @method getVariable
         * @param {string} name
         * @returns {any}
         */
        ConfigManager.prototype.getVariable = function (name) {
            if (!this.hasVariable(name)) {
                throw new Error('Variable "' + name + '" does not exist');
            }
            return this._parsedConfig.variables[name];
        };
        /**
         * Sets a variable to a new value, causes re-render of the config for all urls
         *
         * @method setVariable
         * @param {string} name
         * @param {string} value
         */
        ConfigManager.prototype.setVariable = function (name, value) {
            if (!this._config.environments[this._environment].variables) {
                this._config.environments[this._environment].variables = {};
            }
            this._config.environments[this._environment].variables[name] = value;
            this.render();
        };
        /**
         * Checks if a certain variable exists
         *
         * @method hasVariable
         * @param {string} name
         * @returns {boolean}
         */
        ConfigManager.prototype.hasVariable = function (name) {
            return this._parsedConfig.variables.hasOwnProperty(name);
        };
        /**
         * Gets a certain property
         *
         * @method getProperty
         * @param {string} name
         * @returns {any}
         */
        ConfigManager.prototype.getProperty = function (name) {
            if (!this.hasProperty(name)) {
                throw new Error('Property "' + name + '" does not exist');
            }
            return this._parsedConfig.properties[name];
        };
        /**
         * Gets the properties object
         *
         * @method getProperties
         * @returns {any}
         */
        ConfigManager.prototype.getProperties = function () {
            return this._parsedConfig.properties;
        };
        /**
         * Checks if a property exists
         *
         * @method hasProperty
         * @param {string} name
         * @returns {boolean}
         */
        ConfigManager.prototype.hasProperty = function (name) {
            return this._parsedConfig.properties.hasOwnProperty(name);
        };
        /**
         * Gets the parsed config based on the current environment
         * @method getConfig
         * @returns {app.config.IConfig}
         */
        ConfigManager.prototype.getConfig = function () {
            return this._parsedConfig;
        };
        /**
         * Gets the raw config, including all environments
         *
         * @method getRawConfig
         * @returns {app.config.IConfig}
         */
        ConfigManager.prototype.getRawConfig = function () {
            return this._config;
        };
        /**
         * Re-renders the config based on the current environment
         *
         * @method render
         * @return void
         */
        ConfigManager.prototype.render = function () {
            var _this = this;
            var envs;
            if (this._environment === void 0) {
                envs = [];
            }
            else {
                // current environment
                var env = this._config.environments[this._environment];
                // find and merge all extended properties
                envs = [env];
                while (env.hasOwnProperty('extends') && this.hasEnvironment(env['extends'])) {
                    env = this._config.environments[env['extends']];
                    envs.unshift(env);
                }
            }
            envs.unshift({
                properties: this._config.properties,
                variables: this._config.variables,
                urls: this._config.urls
            });
            envs.unshift({});
            // deep copy (add true as first parameter will do a deep copy when calling $.extend)
            envs.unshift(true);
            this._parsedConfig = $.extend.apply(null, envs);
            // pars recursive variables
            var getVar = function (varName) {
                var type = 'var', variable = '', varParts = varName.split(':'), types = ['url', 'prop', 'property', 'var', 'variable'];
                if (varParts.length > 1 && types['includes'](varParts[0])) {
                    type = varParts.shift();
                    varName = varParts.join(':');
                }
                switch (type) {
                    case 'url':
                        {
                            variable = typeof _this._parsedConfig.urls[varName] === 'string' ? _this._parsedConfig.urls[varName] : _this._parsedConfig.urls[varName].url;
                            break;
                        }
                    case 'prop':
                    //noinspection FallthroughInSwitchStatementJS
                    case 'property':
                        {
                            variable = _this._parsedConfig.properties[varName];
                            break;
                        }
                    case 'var':
                    //noinspection FallthroughInSwitchStatementJS
                    case 'variable':
                    //noinspection FallthroughInSwitchStatementJS
                    default:
                        {
                            variable = _this._parsedConfig.variables[varName];
                            break;
                        }
                }
                if (typeof variable === 'undefined') {
                    return "{" + varName + "}";
                }
                // only replace strings
                if (typeof variable === 'string') {
                    return variable['replace'](_this._varRegExp, function (result, match) {
                        // recursion
                        return getVar(match);
                    });
                }
                else {
                    return variable;
                }
            };
            // copy and parse all types
            var types = ['properties', 'urls', 'variables'];
            for (var x = 0; x < types.length; x++) {
                var type = types[x];
                var vars = this._parsedConfig[type] || {};
                for (var i in vars) {
                    if (!vars.hasOwnProperty(i)) {
                        continue;
                    }
                    if (typeof vars[i] == 'number') {
                        continue; // skip parsing of numbers
                    }
                    var config;
                    var currentVar = vars[i];
                    if (type == 'urls') {
                        if (typeof currentVar === 'string') {
                            currentVar = vars[i] = {
                                url: currentVar
                            };
                        }
                        config = {
                            features: currentVar.features,
                            target: currentVar.target,
                            url: currentVar.url.replace(this._varRegExp, function (result, match) {
                                return getVar(match);
                            })
                        };
                    }
                    else if (typeof currentVar === 'string') {
                        config = currentVar.replace(this._varRegExp, function (result, match) {
                            return getVar(match);
                        });
                    }
                    else {
                        config = JSON.parse(JSON.stringify(currentVar));
                    }
                    this._parsedConfig[type][i] = config;
                }
            }
            window['config'] = this._parsedConfig;
        };
        ConfigManager.prototype.replaceVars = function (subject, variables) {
            return subject['replace'](this._varRegExp, function (result, match) {
                var variable = variables[match];
                if (typeof variable === 'undefined') {
                    return "{" + match + "}";
                }
                else {
                    return variable;
                }
            });
        };
        return ConfigManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConfigManager;
});
