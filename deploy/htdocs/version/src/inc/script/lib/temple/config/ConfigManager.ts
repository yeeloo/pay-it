import refdef from "def/ReferenceDefinitions";
import IConfig from "./IConfig";
import IURLData from "./IURLData";

/**
 * @namespace app.config
 * @class ConfigManager
 */
class ConfigManager
{
	private _config:IConfig;
	private _parsedConfig:IConfig;
	private _environment:string;
	private _varRegExp:any = /\{([^}]+)\}/gi;

	/**
	 *
	 * @todo define config
	 * @method init
	 * @param {IConfig} config
	 * @param {string} environment
	 */
	public init(config:IConfig, environment:string):void
	{
		this._config = config;

		// set default groups on base object, so the functions below will never fail
		this._config.variables = this._config.variables || {};
		this._config.urls = this._config.urls || {};
		this._config.properties = this._config.properties || {};

		// sets the detected environment
		if (environment !== void 0)
		{
			this.setEnvironment(environment);
		}
		else
		{
			this.render();
		}
	}

	/**
	 * Gets the current environment
	 *
	 * @method getEnvironment
	 * @returns {string}
	 */
	public getEnvironment():string
	{
		return this._environment;
	}

	/**
	 * Sets the new environment, causes a re-render of the config
	 *
	 * @method setEnvironment
	 * @param {string} environment
	 * @return {void}
	 */
	public setEnvironment(environment:string):void
	{
		if (this.hasEnvironment(environment))
		{
			this._environment = environment;
		}
		else
		{
			throw new Error('Environment "' + environment + '" is not defined');
		}
		this.render();
	}

	/**
	 * Checks if we have a certain environment
	 *
	 * @method hasEnvironment
	 * @param {string} environment
	 * @returns {boolean}
	 */
	public hasEnvironment(environment:string):boolean
	{
		return this._config.environments && this._config.environments.hasOwnProperty(environment);
	}

	/**
	 * Get a URL by it name.
	 * This method throws an error if a URL with the provided name doesn't exists.
	 *
	 * @method getURL
	 * @param {string} name
	 * @param {any} variables
	 * @returns {string}
	 */
	public getURL(name:string, variables?:{[key:string]:any}):string
	{
		if (!this.hasURL(name))
		{
			throw new Error('URL "' + name + '" does not exist');
		}

		var url:string = this._parsedConfig.urls[name].url;

		if (variables)
		{
			url = this.replaceVars(url, variables);
		}

		return url;
	}

	/**
	 * Gets a certain URL Configuration.
	 * This method throws an error if a URL with the provided name doesn't exists.
	 *
	 * @method getURLConfig
	 * @param {string} name
	 * @returns {app.config.IURLData}
	 */
	public getURLConfig(name:string):IURLData
	{
		if (!this.hasURL(name))
		{
			throw new Error('URL "' + name + '" does not exist');
		}

		return this._parsedConfig.urls[name];
	}

	/**
	 * Opens a (popup) URL by it's name.
	 * This method throws an error if a URL with the provided name doesn't exists.
	 *
	 * @method openURL
	 * @param {string} name
	 * @param {any} variables When an object, it will be used to replace variables. when a function, it will call that function before opening the url so you can change the url yourself to have more control.
	 * @return void
	 */
	public openURL(name:string, variables?:{[key:string]:any}):void;
	public openURL(name:string, variables?:(url:string) => string):void;
	public openURL(name:string, variables?:any):void
	{
		if (!this.hasURL(name))
		{
			throw new Error('URL "' + name + '" does not exist');
		}

		var configURL:IURLData = this._parsedConfig.urls[name];
		var url:string = configURL.url;

		if (variables)
		{
			if (typeof variables == "function")
			{
				url = variables(url);
			}
			else
			{
				url = this.replaceVars(url, variables);
			}
		}

		window.open(url, configURL.target, configURL.features);
	}

	/**
	 * Checks if a certain url exists.
	 *
	 * @method hasURL
	 * @param {string} name
	 * @returns {boolean}
	 */
	public hasURL(name:string):boolean
	{
		return this._parsedConfig.urls.hasOwnProperty(name);
	}

	/**
	 * Gets a certain var
	 *
	 * @method getVariable
	 * @param {string} name
	 * @returns {any}
	 */
	public getVariable(name:string):any
	{
		if (!this.hasVariable(name))
		{
			throw new Error('Variable "' + name + '" does not exist');
		}
		return this._parsedConfig.variables[name];
	}

	/**
	 * Sets a variable to a new value, causes re-render of the config for all urls
	 *
	 * @method setVariable
	 * @param {string} name
	 * @param {string} value
	 */
	public setVariable(name:string, value:any):void
	{
		if (!this._config.environments[this._environment].variables)
		{
			this._config.environments[this._environment].variables = {};
		}

		this._config.environments[this._environment].variables[name] = value;

		this.render();
	}

	/**
	 * Checks if a certain variable exists
	 *
	 * @method hasVariable
	 * @param {string} name
	 * @returns {boolean}
	 */
	public hasVariable(name:string):boolean
	{
		return this._parsedConfig.variables.hasOwnProperty(name);
	}

	/**
	 * Gets a certain property
	 *
	 * @method getProperty
	 * @param {string} name
	 * @returns {any}
	 */
	public getProperty(name:string):any
	{
		if (!this.hasProperty(name))
		{
			throw new Error('Property "' + name + '" does not exist');
		}
		return this._parsedConfig.properties[name];
	}

	/**
	 * Gets the properties object
	 *
	 * @method getProperties
	 * @returns {any}
	 */
	public getProperties():any
	{
		return this._parsedConfig.properties;
	}

	/**
	 * Checks if a property exists
	 *
	 * @method hasProperty
	 * @param {string} name
	 * @returns {boolean}
	 */
	public hasProperty(name:string):boolean
	{
		return this._parsedConfig.properties.hasOwnProperty(name);
	}

	/**
	 * Gets the parsed config based on the current environment
	 * @method getConfig
	 * @returns {app.config.IConfig}
	 */
	public getConfig():IConfig
	{
		return this._parsedConfig;
	}

	/**
	 * Gets the raw config, including all environments
	 *
	 * @method getRawConfig
	 * @returns {app.config.IConfig}
	 */
	public getRawConfig():IConfig
	{
		return this._config;
	}

	/**
	 * Re-renders the config based on the current environment
	 *
	 * @method render
	 * @return void
	 */
	public render():void
	{
		var envs:Array<IConfig>

		if (this._environment === void 0)
		{
			envs = [];
		}
		else
		{
			// current environment
			var env:IConfig = this._config.environments[this._environment];

			// find and merge all extended properties
			envs = [env];

			while(env.hasOwnProperty('extends') && this.hasEnvironment(env['extends']))
			{
				env = this._config.environments[env['extends']];
				envs.unshift(env);
			}
		}

		envs.unshift({
			properties: this._config.properties,
			variables: this._config.variables,
			urls: this._config.urls
		});
		envs.unshift(<any>{});

		// deep copy (add true as first parameter will do a deep copy when calling $.extend)
		envs.unshift(<any>true);
		this._parsedConfig = <IConfig>$.extend.apply(null, envs);

		// pars recursive variables
		var getVar = (varName) =>
		{
			var type = 'var',
				variable:string = '',

				varParts = varName.split(':'),
				types = ['url', 'prop', 'property', 'var', 'variable'];

			if (varParts.length > 1 && types['includes'](varParts[0]))
			{
				type = varParts.shift();
				varName = varParts.join(':');
			}

			switch (type)
			{
				case 'url':
				{
					variable = typeof this._parsedConfig.urls[varName] === 'string' ? <string>this._parsedConfig.urls[varName] : this._parsedConfig.urls[varName].url;
					break;
				}

				case 'prop':
				//noinspection FallthroughInSwitchStatementJS
				case 'property':
				{

					variable = this._parsedConfig.properties[varName];
					break;
				}

				case 'var':
				//noinspection FallthroughInSwitchStatementJS
				case 'variable':
				//noinspection FallthroughInSwitchStatementJS
				default:
				{
					variable = this._parsedConfig.variables[varName];
					break;
				}
			}
			if (typeof variable === 'undefined')
			{
				return "{" + varName + "}";
			}

			// only replace strings
			if (typeof variable === 'string')
			{
				return variable['replace'](this._varRegExp, (result, match) =>
				{
					// recursion
					return getVar(match);
				});
			}
			else
			{
				return variable;
			}
		};

		// copy and parse all types
		var types = ['properties', 'urls', 'variables'];

		for (var x = 0; x < types.length; x++)
		{
			var type = types[x];
			var vars = this._parsedConfig[type] || {};

			for (var i in vars)
			{
				if (!vars.hasOwnProperty(i))
				{
					continue;
				}

				if (typeof vars[i] == 'number')
				{
					continue; // skip parsing of numbers
				}

				var config;
				var currentVar = vars[i];

				if (type == 'urls')
				{
					if (typeof currentVar === 'string')
					{
						currentVar = vars[i] = {
							url: currentVar
						}
					}

					config = <IURLData>{
						features: currentVar.features,
						target: currentVar.target,
						url: currentVar.url.replace(this._varRegExp, (result, match) =>
						{
							return getVar(match);
						})
					};
				}
				// only replace strings
				else if (typeof currentVar === 'string')
				{
					config = currentVar.replace(this._varRegExp, (result, match) =>
					{
						return getVar(match);
					});
				}
				// clone objects
				else
				{
					config = JSON.parse(JSON.stringify(currentVar));
				}

				this._parsedConfig[type][i] = config;
			}
		}

		window['config'] = this._parsedConfig;
	}

	private replaceVars(subject:string, variables?:{[key:string]:any}):string
	{
		return subject['replace'](this._varRegExp, (result, match) =>
		{
			var variable = variables[match];
			if (typeof variable === 'undefined')
			{
				return "{" + match + "}";
			}
			else
			{
				return variable;
			}
		});
	}
}

export default ConfigManager;