/// <reference path="../../tsd/knockout/knockout.d.ts" />

interface KnockoutBindingHandlers
{
	localizedText: KnockoutBindingHandler;
	localizedImage: KnockoutBindingHandler;
	localizedBgImage: KnockoutBindingHandler;
	allowBindings: KnockoutBindingHandler;
}

interface KnockoutTemplateSources
{
	stringTemplate:any;
	//  @todo implement new in source binding
	//	domElement: any;
}

interface KnockoutStatic
{
	templates: any;
}

interface KnockoutUtils {
	setTextContent( node: Element, text: string );
}