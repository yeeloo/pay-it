## Project Structure

Project structure overview:

*   inc folder: with image, style, script, template
*   script folder: with app, lib and mobile
*   app folder: with component, config, data, net, page, Main and Startup
*   lib folder with Externals, Definitions, and other folders
*   template folder: with files and mobile

## Sitemap

Gaia uses a JSON file to define the site structure called sitemap.js.

Open the sitemap.js file in your favorite xml editing program. A general sitemap.js could look like this:

```
define({
	"title": "Gaia - {page}",
	"config": {
		"controllerPath": "app/page/",
		"viewModelPath": "app/page/",
		"templatePath": "../../../../template/"
	},
	"routes": [
	],
	"pages": [
		{
			"id": "index",
			"title": "index",
			"pages": [
				{
					"id": "home",
					"title": "Home"
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
		}
	]
});
```

### Title

The title attribute is used to set the page's title.

The `{page}` variable is replaced by the `"title"` attribute from the active page, so when you are on the home-page title will say `Gaia - Home`.

### Config

The config section is used for setting paths to the files that are loaded by Gaia. You normally won't touch these, but if you are doing some funky stuff you can change them here.

### Routes

Routes are unused at the moment.

### Pages

The `"pages"` array is the main part of the sitemap. It defines all the pages for your site.

A page can have have pages by itself, allowing for

```
{
	"id": "home",
	"title": "Home Page",
	"route": "home-page"
	"controller": "default" | "mobile" | "path/to/HomeController",
	"viewModel": "default" | "mobile" | "path/to/HomeViewModel",
	"template": "default" | "mobile" | "path/to/template.html",
	"folder": "folder/path/",
	"data": {"custom": "data", "in": ["here"]},
	"pages": [],
	"landing": true
}
```

#### id (required)

Used for navigating to the page, used for loading files by convention

#### title

Used in the browsers title-bar by inserting this value in the site title `"title": "Gaia - {page}"`.

#### route

Used in the url-bar when navigating to pages and used for deeplinking.

If omitted, it will slugify the title value.

Routes **must be unique** and can only be applied to terminal pages (pages that have no subpages).

Can be expanded to an object for deeplinking and parameters.

```
{
	"id": "detail",
	"route": {
		"base": "detail", // base route, will do the match to this page
		"deeplink": "/:id/:title", // path-segments starting with : will be put into the params object with their variable-name
		"validation": { // test the input with the regex, will only be filled if valid
			"id": "\\d+",
			"title": "[\\w\\-]+"
		},
		"defaults": { // set default values for the params. providing a default value makes them optional
			"id": -1,
			"title": "defaultTitle"
		}
	}
}
```
```
{
	"id": "video",
	"route": {
		"base": "video", // base route, will do the match to this page
		"type": "regex",
		"deeplink": "/(\\d+)(?:/([\\w\\-]+))?", // match id and optional value
		"map": [ // map capturing groups to param-names
			"id",
			"title"
		],
		"defaults": { // set default values for the params. providing a default value makes them optional
			"id": -1,
			"title": "defaultTitle"
		},
		"reverse": "/:id/:title" // when we want to rebuilt the string, because it's hard to figure that stuff out from the regex
	}
}
```

#### controller

Most of the time you want to leave this out. Doing this will let Gaia load the file 'by convention' using value of 'id' . E.g. `"id": "home"` will result in `"home/HomeController"`

If you want something else, you can provide your own path, or some special values as seen below.

```
"controller": "path/to/PageController",
```

Passing a custom value (relative to `inc/script/app/page/`) to the Controller you want to use. This is mostly used for letting multiple pages use the same controller.

```
"controller": "default",
```

Uses the default controller (that every controller extends): `DefaultPageController`

```
"controller": "mobile",
```

This will to the same as leaving out the controller, but makes a switch when visiting the site via a mobile device. In that case instead of loading `inc/script/app/page/home/HomeController` it will load `inc/script/mobile/page/home/HomeController`.

```
"controller": {
	"app": "path/to/PageController",
	"mobile": "mobile/path/to/PageController"
},
```

If you want to have a different controller for normal and mobile site but don't want them to be in the default place, you can provice an object with different values for `app` and `mobile`.

#### viewModel

The viewModel uses the same values as the controller does, but the `"default"` resolves to `DefaultPageViewModel`

#### template

The template uses the same values as the controller does, but the `"default"` resolves to `default.html` and `"mobile"` resolves to `inc/template/mobile/page.html` instead of `inc/template/page.html`

#### folder

If you want to group several pages, you can set this value to pass a directory. E.g. passing `"folder": "products/"` will load the file from `inc/script/app/pages/products/page/PageController`.

As a side-effect you can use the value to prefix the default-page-folder or template-name if you omit the trailing `/`.

#### data

Custom data associated to the page that can be used by code; e.g. for including pages in the navigation, or require authentication to access the pages, or adding a breadcrumb value.

This data can be accessed by calling `PageAsset.getData('key')`.

#### pages

Here you can insert a list of subpages for the current page. As you can see in the sitemap example this is also done for the index-page.
	This subpages are not the same as subpages in a conventional sitemap that show a hierarchical view of grouped sections.
	The structure in this sitemap is for defining which pages should be visible at the same time. So navigating to a sub-page will not close the parent page, but instead let them be visible at the same time.

If we take the index-page as an example, we can add the header, navigation, footer and background to the index-page, and the actual page-content to the subpages (home, products, contact).
	Because the index-page will never be closed (it is the root page of the sitemap), those elements will always remain visible.

Now, if we want to have an intro-page that has no navigation, we can do two things. The first option is to hide the navigation when we are on the intro page, and show them on the other pages.
	The other option is to move the navigation elements to a navigation-page, that is a sibling from the intro-page, and move all the other pages as subpages in the navigation-page.
	Because the navigation-page is a parent-page from the home-page, but not from the intro-page, it will only be visible on the home-page.
	The result would look like this:

```
"pages": [
	{
		"id": "index",
		"pages": [
			{
				"id": "intro"
			},
			{
				"id": "navigation",
				"pages": [
					{
						"id": "home"
					},
					{
						"id": "contact"
					}
				]
			}
		]
	}
],
```
When navigationg to pages you should use the path to the page you want to navigate to including all the parent pages, like `Gaia.api.goto('/index/navigation/home');`.

For more information about navigating see the reference for `Gaia.api.goto`

#### landing

By default, landing is set to false, and Gaia will load the first subpage of a page until there are no subpages anymore, so you won't be stuck on a navigation-page without any content in there. If you don't want this default behavior you can set `"landing": true` so you are able to land on this page.

### Popups

Popups are special pages that are inserted as sub-pages for every page in the sitemap. This way you can open a popup-page without navigating away from the current page.

Like normap pages, you can nest popup-pages. Nested popup-pages need to have a `"type"` attribute set to `"popup"`

Opening and closing popups can be done by using `Gaia.api.gotoPopup("popupId");` and `Gaia.api.closePopup();` from code, and the `data-gaia-popup="popupId"` and `data-gaia-popup-close` attributes from HTML.

## Scaffolding

Running `grunt scaffold` from within the `/tools/build/` folder will create all the files (Controller.ts, ViewModel.ts and page.html) needed to run the site.