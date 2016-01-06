interface ILocaleProvider
{
	/**
	 * Start providing the locale
	 * When loading is complete the provider automaticly adds the data to the LocaleManager bij using 'LocaleManager.getInstance().addText'
	 */
	provide(locale:string):void;

	/**
	 * Returns true if the provider already has provided the data of a locale
	 */
	hasProvided(locale:string):boolean;

	/**
	 * Returns true is provider has data for a locale
	 */
	hasLocale(locale:string):boolean;

	/**
	 * Returns a list of locales
	 */
	getLocales():any[];
}

export default ILocaleProvider;