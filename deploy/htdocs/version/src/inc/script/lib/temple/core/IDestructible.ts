import refdef from "def/ReferenceDefinitions";

interface IDestructible
{
	isDestructed():boolean;
	destruct():void;
}

export default IDestructible;