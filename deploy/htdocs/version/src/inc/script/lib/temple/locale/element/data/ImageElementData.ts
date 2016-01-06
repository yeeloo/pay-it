import AbstractElementData from "./AbstractElementData";

/**
 * @module Temple
 * @namespace temple.locale.element.data
 * @extend temple.locale.element.data.AbstractElementData
 * @class ImageElementData
 */
class ImageElementData extends AbstractElementData
{
	constructor(element:any, public url:string)
	{
		super(element);
	}
}

export default ImageElementData;