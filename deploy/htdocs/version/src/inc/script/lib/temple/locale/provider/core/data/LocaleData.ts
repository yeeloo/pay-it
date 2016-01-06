import ILocaleData from "../interface/ILocaleData";

/**
 * @module Temple
 * @namespace temple.locale.provider.core.data
 * @class LocaleData
 */
class LocaleData implements ILocaleData
{
	public locale:string;
	public name:string;
	public url:string;
	public loaded:boolean;
	public data:any;

	constructor(locale:string, name:string, url:string)
	{
		this.locale = locale;
		this.name = name;
		this.url = url;
	}
}

export default LocaleData;