interface IRoute
{
	base: string;
	disabled?: boolean;
	deeplinkDisabled?: boolean;
	type?: string;
	deeplink?: string;
	validation?: any;
	map?: string[];
	defaults?: any;
	reverse?: string;
	replace?: boolean;
}

export default IRoute;
