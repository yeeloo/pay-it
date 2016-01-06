import refdef from "def/ReferenceDefinitions";
import AbstractElementData from "./AbstractElementData";
import IEaselTextElement from "./IEaselTextElement";

/**
 * @module Temple
 * @namespace temple.locale.element.data
 * @extend temple.locale.element.data.AbstractElementData
 * @class EaselTextData
 */
class EaselTextData extends AbstractElementData
{
	constructor(element:IEaselTextElement, public id:string, public key:string)
	{
		super(element);
	}
}

export default EaselTextData;