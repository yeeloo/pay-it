import IAssetNode from "lib/gaia/interface/IAssetNode";

interface IPageNode
{
	id: string;
	title?: string;
	route?: any;
	controller?: any;
	viewModel?: any;
	template?: any;
	type?:string;
	folder?:string;
	data?: any;
	assets?: Array<IAssetNode>;
	pages?: Array<IPageNode>;
	popups?: Array<IPageNode>;
	landing?: boolean;
	container?: string;
	defaultChild?: string;
	partials?:{
		app?: Array<string>;
		mobile?: Array<string>;
	};
}

export default IPageNode;