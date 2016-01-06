import refdef from "def/ReferenceDefinitions";
import Log from "../utils/Log";

class FormUtils
{
	public static getValue(name:string, form?:HTMLFontElement):any
	{
		var input:HTMLInputElement = <HTMLInputElement>$("[name='" +name + "']" , form)[0];

		if (input)
		{
			return input.value;
		}
		else
		{
			Log.error('Temple.Util.FormUtils', "No input found with name '" + name + "'");
		}
		return null;
	}
}

export default FormUtils;