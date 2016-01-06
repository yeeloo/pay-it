## Introduction

The Gaia API simplifies the way you interact with the framework. Most of the power of Gaia comes from how you
	structure your site.xml and how you handle its events.

## How To Use The Gaia API

This is the preferred method of using the Gaia API

<script type="syntaxhighlighter" class="brush: ts; type: example"><![CDATA[
	import Gaia = require("lib/gaia/api/Gaia");
	Gaia.api.methodName();
]]>
</script>

## Gaia API Methods

Here is a description of all the methods available in the Gaia API.

### goto

<script type="syntaxhighlighter" class="brush: ts; type: signature"><![CDATA[
	goto(branch:string, flow?:string):void;
]]>
</script>

goto is the primary method you will be using in Gaia. It requires at least one argument and that is a string of the
	branch you want to navigate to.

It has support for absolute paths, starting with a `/`, or relative paths. You can also use
	`./` or `../` to go a level up.

<script type="syntaxhighlighter" class="brush: ts; type: example"><![CDATA[
	Gaia.api.goto("/index/docs/getting-started");
	Gaia.api.goto("./api"); // resolves in /index/docs/api
	Gaia.api.goto("../home"); // resolves in /index/home
]]></script>

Gaia will determine the nearest valid branch to what you passed. Passing "index" will result in Gaia going to the
	first valid branch under index. Also, if you pass a branch that doesn't exist, it will recurse up the branch until
	it finds a valid branch, and then back down to the termination of that branch. This might end up being the index
	branch.

For instance, if the valid branch is `/index/nav/people/friends` and you pass
	`/index/nav/people/free`, it will find the nearest branch to what you passed
	`/index/nav/people` and since people has a child page, it will terminate the branch at `/index/nav/people/friends`.

#### HTML

You can also use `goto` directly from your HTML-markup by adding a `data-gaia-goto` attribute.

<script type="syntaxhighlighter" class="brush: html; type: example" title="Use from HTML:"><![CDATA[
	[Api](/index/docs/api)
	<span data-gaia-goto="/index/docs/api">Api</span>
]]>
</script>

If the `data-gaia-goto` is empty it looks for the href value.

<div class="bs-callout bs-callout-danger">

#### Cross-browser compatibility

		In IE7 you always have to use the `data-gaia-goto` attribute, because when you read the href-attribute, it gets returned as an absolute URL instead of the value you put in.

</div>

#### Deeplink

If you navigate to somewhere deeper than the last child of a branch in the site.xml, such as `/index/nav/people/friends/john`,
	Gaia stores `/john` and you can access it through the API directly via the method
	`getDeeplink()`.

Gaia sends out a deeplink event when there is a branch beyond the valid branch, which you can listen to through the
	API.

Pages are automatically set up to listen to this event through the `onDeeplink()` method. See the [Pages](/index/docs/pages) section of the documentation for more information.

To update the browser address bar with a deeplink beyond the last child of the branch, call goto with the page's
	branch appended with your deeplink.

```

	Gaia.api.goto("/index/nav/people/friends/john");
```

If Gaia is already at the valid page `/index/nav/people/friends`, it will simply update the address bar in
	the browser with your custom deeplink. Deeplinks do not have to be separated by slashes, you can punt anything after
	the `/`, even create your own format for sending the data.

#### Flow

The optional `flow` argument is for overriding the flow for the goto event. Use the flow constants for
	these: `Gaia.NORMAL`, `Gaia.PRELOAD`, `Gaia.CROSS`, and `Gaia.REVERSE`.
	Gaia will use that and ignore the page's flow type as well as the site's default flow. **This feature is primarily
		used for testing during development only.**
	If you pass a flow, and then use the browser to navigate back and forward, the passed flow will not be used again
	because SWFAddress is what
	is calling goto then, not your original goto. For production, you should set the flow on the page either through
	sitemap.js or at runtime.

### gotoRoute

```

	gotoRoute(route:string, deeplink?:string, flow?:string):void;
```

todo

### gotoPopup

```

	gotoPopup(popupId:string):void;
```

In your sitemap.js, below the pages array, you can specify a popup array with pages that will act as popups.

```

define({
	"title": "Skeleton - Gaia - {page}",
	"routes": [
	],
	"pages": [
		{
			"id": "index",
			"title": "index",
			"landing": false,
			"pages":[
				{
					"id": "home",
					"title": "home",
					"controller": "default",
					"viewModel": "default",
					"template": "default"
				},
				{
					"id": "contact",
					"title": "contact",
					"controller": "default",
					"viewModel": "default",
					"template": "default"
				}
			]
		}
	],
	"popups": [
		{
			"id": "popup1",
			"title": "popup1",
			"controller": "default",
			"viewModel": "default",
			"template": "default"
		},
		{
			"id": "popup2",
			"title": "popup2",
			"controller": "default",
			"viewModel": "default",
			"template": "default"
		}
	]
})
```

Under the hood, these popup-pages will be added as sub-pages for every normal page, so when you open a popup from that page, the popup will be opened as sub-page.

#### HTML

You can also use `gotoPopup` directly from your HTML-markup by adding a `data-gaia-popup` attribute.

```

	[Terms](terms)
	<span data-gaia-popup="terms">Terms</span>
```

If the `data-gaia-popup` is empty it looks for the href value.

<div class="bs-callout bs-callout-danger">

#### Cross-browser compatibility

		In IE7 you always have to use the `data-gaia-popup` attribute, because when you read the href-attribute, it gets returned as an absolute URL instead of the value you put in.

</div>

### closePopup

```

	closePopup():void;
```

This method closes the popup that was previously opened by `gotoPopup`. If no popup was opened, it doesn't do anything.

#### HTML

You can also use `closePopup` directly from your HTML-markup by adding a `data-gaia-popup-close` attribute.

```

	[Close](#)
	<span data-gaia-popup-close>Close</span>
```

### getPage

```

	getPage(branch:string):PageAsset;
```

Returns the instance of the `PageAsset` for that page. You pass it a branch and it returns the PageAsset of the final page of that branch. If the final leaf of the branch you passed is not a valid page id, it will return `undefined`.

PageAsset has a property called `children`, which is an object which contains properties that match the ids of the pages of those children, and the values of those properties are the PageAssets themselves. PageAssets are aware of who their parent is, and pages also store their branch as a public property.

If you need to target the Controller of a page for custom properties or functions, use the `getContent()` method of the PageAsset.

Or if you need information that is stored in the sitemap.js for that page, use the `getData()` or `getParams()` method of the PageAsset.

```
	Gaia.api.getPage("/index/home").getContent().myProp = value;
	Gaia.api.getPage("/index/home").getContent().myFunc();
	Gaia.api.getPage("/index/home").getData('show-nav');
	Gaia.api.getPage("/index/home").getParams().id;
```

More information about page properties can be found in the [PageAsset](/index/docs/sitemap/page-asset), [Controller](/index/docs/pages/controller) and [Sitemap](/index/docs/sitemap) sections of the documentation.