import AbstractElementData from "./AbstractElementData";
import ITextFormatter from "../../formatter/ITextFormatter";

/**
 * @module Temple
 * @namespace temple.locale.element.data
 * @extend temple.locale.element.data.AbstractElementData
 * @class HTMLElementData
 */
class HTMLElementData extends AbstractElementData
{
	constructor(element:any, public id:string, public attr:string, public formatters:Array<ITextFormatter>)
	{
		super(element);
	}
}

export default HTMLElementData;