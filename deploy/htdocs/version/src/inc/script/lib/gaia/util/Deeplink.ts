import refdef from 'def/ReferenceDefinitions';
import * as Gaia from 'lib/gaia/api/Gaia';

class Deeplink
{
	[param:string]:any;

	public add(key:string, value:any):Deeplink
	{
		this[key] = value;
		return this;
	}

	public copy(key:string):Deeplink
	{
		this[key] = Gaia.api.getParam(key);
		return this;
	}
}

export default Deeplink;