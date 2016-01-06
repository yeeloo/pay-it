import IURLData from "./IURLData";

interface IConfig
{
	variables:{[name:string]:any};

	urls:{[name:string]:IURLData};

	properties:{[name:string]:any};

	environments?:{[name:string]:IConfig};

	extends?:string;
}

export default IConfig;