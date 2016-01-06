interface IEaselTextElement
{
	text: string;
	textAlign: string;
	cache: (x:number, y:number, width:number, height:number) => void;
}

export default IEaselTextElement;