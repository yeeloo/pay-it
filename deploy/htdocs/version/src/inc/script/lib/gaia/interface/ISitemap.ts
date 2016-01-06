import IPageNode from "./IPageNode";

interface ISitemap
{
	title: string;
	config: {
		controllerPath?: string;
		viewModelPath?: string;
		templatePath?: string;
	};
	pages: IPageNode[];
	popups?: IPageNode[];
	routes?: any;
	routing?: boolean;
	history?: boolean;
	indexFirst?: boolean;
	version?: number;
}

export default ISitemap;