## Structure

Todo sitemap structure.

## Pages

Todo pages

## Routing

```
Gaia.router:GaiaRouter
```

	Where the job of the sitemap.js is to setup the structure of the site and handle in-site-navigation, the job of the GaiaRouter is to match those pages to url's, so you can deeplink to pages and use the browsers back/forward buttons.

	You can define a list if routes that map to branches and configure each route with extra logic.

	With that list of routes the GaiaRouter can do 2 things, **resolve** a route to a page, and **assemble** a page to a route.

	Read below to see how you can configure the router and add routes.

	Look at the bottom to see a full example of a sitemap combined with routes.

### Config

```
config():GaiaRouterConfig;
```

	Use the GaiaRouterConfig to setup the GaiRouter.

	You can for example disable the router, set default assertions rules or setup localized routes.

```
Gaia.router.config()
			.enable()
			.useFallback()
			.removeExtraSlashes(true)
			.assert('id', '\\d+')
			.setLocale('nl_NL')
			.setTranslator({}, 'routes');
```

#### In development

		At the moment only `assert()` is implemented and the routing is always enabled. Other options will be added in future releases.


#### assert()

```
assert(param:string, regex:string):GaiaRouterConfig;
```

Sets default assertions for all routes.

For more information about assertions, check the `GaiaRoute.assert()` method below.

### notFound

```
notFound(branch:string):GaiaRouter;
```

	When there are no matching routes found, the `resolvePage()` uses the passed branch.

	If this method is never called, `null` is returned so Gaia will go the the home of the website.

```
Gaia.router.notFound('index/error-404');
```

#### Subject to change

		Because this method can only be called once, it might be moved to `Gaia.router.config().notFound('branch')`.


### redirect

```
redirect(route:string, redirect:string):GaiaRoute;
```

Redirects from one route to another, where the new router is picked op for resolving.

When the router is trying to resolve the route, and runs in to a redirect route, it stops the lookup and start a new lookup with the 'redirect' route as input.

```
Gaia.router.redirect('/terms', '/info');
```


#### Circular recursion

		Watch out for circular recursion when adding redirect rules that redirect to each other.


### page

```
page(route:string, branch:string):GaiaRoute;
```

	This is the most important part of the router, it matches routes to pages.

	You have to pass a route to match, and a branch for a page to resolve to.

	The passed route string can be a **static** route or a **dynamic** route.

	A **static** route is just a string to match.

	A **dynamic** route however, can match dynamic values, that can be optional or greedy, and has even support for regular expressions.

	A dynamic route can have parameters (like an article id or a search filter) which can be retrieved by with `Gaia.api.getParam('name')`.

	There are other options to configure that will be used after a route is matched, like parameter assertion, setting a default value or converting the paramter to a different data-type.

	Those options can be configured by calling methods on the returned `GaiaRoute` object from this method.

```
Gaia.router.page('/', 'index/home');
```

&nbsp;

Below are some examples of the different type of routes you can use.

##### Static

The example below demonstrates a static route. It will try to exactly match the route.

```
Gaia.router.page('/static-route', 'branch');
```

##### Dynamic

The example below demonstrates a dynamic route with 2 parameters, `id` and `slug`.

```
Gaia.router.page('/detail/:id/:slug', 'branch');
```

##### Dynamic optional

	The example below demonstrates a dynamic route with an optional parameter.

	By default the parameters are required for a match, by adding a `?` the param becomes optional.

```
// this is an optional dynamic route part for 'filter'
Gaia.router.page('/overview/:filter?', 'branch');
```


#### Usage

		If you follow an optional parameter up by a required parameter you might get unexpected results where values are matched for wrong parameters.

#### Usage

		When providing a `value('param', 'value')` the route automatically becomes optional.


##### Dynamic greedy

	The example below demonstrates a dynamic route with a greedy parameter.

	By default, only characters between `/` are matched for a parameter.
	If you want to match characters between de `/` boundaries you can add a `*` to make the param greedy.
	It will now match everything until the next part in the route or the end.

```
Gaia.router.page('/search/:query*', 'branch');
```

#### Usage

		If you follow up a greedy parameter with an optional parameter the optional parameter always is empty because it is consumed by the greedy match.


##### Regular expression

	The example below demonstrates a dynamic route that uses a regular expression.

	As you can see it's possible to mix regular expressions with dynamic parameters.

	The filter part will contain multiple `/[a-z]` parts ending with an optional page number.

	In regular expressions you can use named capture groups that look like `(?<filters>)` to match the group as a parameter.

	The page parameter is asserted to only contain digits, and the filter parameter is stripped from it's leading `/` to make it easier to `split` the string into an array.

	For more information about assert, check the `GaiaRoute.assert()` method below.

	For more information about convert, check the `GaiaRoute.convert()` method below.

	When using regular expressions in routes it's necessary provide a specification to assemble the route from parameters.

	For more information about the specification, check the `GaiaRoute.spec()` method below.

```
Gaia.router.page('/search(?<filters>(?:/[a-z][^/]*)*)/:page?', 'branch')
	.assert('page', '\\d+')
	.convert('filters', (filters) =>
	{
		return filters.substr(1);
	})
	.spec('/search/{filters}/{page}');
```

#### assert()

```
assert(param:string, regex:string):GaiaRoute;
```

Asserts a param by executing a regular expression on the value.

If one of the assertions fail, this route will not match when resolving a route.

When using the same assertions for multiple routes, you can use `Gaia.router.config().assert()` to setup default assertions.

```
Gaia.router.page('/detail/:id/:slug', 'index/detail')
	.assert('id', '\\d+')
	.assert('slug', '[\\w-]+');
```


#### In development

		At the moment the assertion is only ran when resolving a route, not when assembling it.

		So if you pass a incorrect deeplink value to `Gaia.api.goto()` and reload the page, the current route will fail to match.

#### value()

```
value(param:string, value:any):GaiaRoute;
```

Sets a default value for the param. Setting a value also makes the param optional.

	The type of the default value is always a string to match the output of a normal match.

	You can use `convert()` to convert a matched param to a different type.

```
Gaia.router.page('/detail/:id/:slug', 'index/detail')
	.value('id', '1')
	.value('slug', 'first-item');
```



#### Usage

		If you set the default value to `null` (or make the params optional), you can use that to still resolve to the detail page.

		On the page itself you can then do a redirect to the overview page.


#### convert()

```
convert(param:string, fn:(param:string) => any):GaiaRoute;
```

After matching a route, the convert-functions will be called for every parmeter, so you can convert them to the correct data-type.

```
Gaia.router.page('/detail/:page', 'index/detail')
	.assert('page', '\\d+')
	.convert('page', (page) =>
	{
		return +page;
	});
```



#### Usage

		The convert-functions will only be called when resolving a route, and not when assembling it.

		So if you change the actual value and use that to re-assemble the route, the resulting route will be different.


#### spec()

```
spec(route:string):GaiaRoute;
```

When using regular expressions in routes, it's impossible to re-assemble the route. In those cases you have to provide a specification to re-assemble the route when using `Gaia.api.goto()`.

```
router.page('/recipes/(?<filters>.+)/:page', 'index/recipes')
	.spec('/recipes/{filters}/{page}');
```

#### Usage

		If you neglect to provide a spec when using a regular expression in the route, the assembled route will contain the regular expression.

</div>

#### redirectOnLanding()

```
redirectOnLanding(route:string = '/'):GaiaRoute;
```

	If you want to disable pages on landing (or when refreshing the browser), but want them to have a route when using the back/forward buttons you can use this method.

	It only executes the redirect to the given route when the route is resolved at landing.

```
router.page('/landing-test', 'index/landing')
	.redirectOnLanding('/home');
```

### resolvePage

```
resolvePage(url:string, includeRedirects:boolean = false):IRouteResult[];
]]>
</script>
<script type="syntaxhighlighter" class="brush: ts; type: signature"><![CDATA[
interface IRouteResult
{
	branch:string;
	deeplink:{
		[param:string]:any;
	}
}
```
	This method resolves a route to page, and is the opposite of the `assemble()` method. The url that is passed is the 'deeplink' part of the URL (everything after the root of the website).

	It looks for matches in the route-list that is set-up by calling `Gaia.router.page('route', 'branch')`.

	When it runs in a 'redirect' match (added via `Gaia.router.redirect('route', 'redirect')`), it uses the result of that rule to restart the lookup.

	When nothing is found it checks if there is a 'notFound' rule added (via `Gaia.router.notFound('branch')`).

	If there is it returns that branch. If there is not, `null` is returned so Gaia will go the the home of the website.

	In Gaia, this method is called on multiple locations:

*   When you land on or refresh the website.
*   When you use the browsers back/forward buttons.

```
Gaia.router.resolve('/detail/23/foobar');

// returns
[
	{
		"branch": "index/detail",
		"deeplink": {
			"id": 23,
			"slug": "foobar"
		}
	}
]
```

<div class="bs-callout bs-callout-info">

#### Usage

		This method is called from within Gaia, and you probably won't use it yourself.

</div>

### assemble

```
assemble(branch:string, params:any = {}):string;
```

	This method assembles a route from a page, and is the opposite of the `resolvePage()` method. It takes the same parameters as `Gaia.api.goto()`.

	It looks for matches in the route-list that is set-up by calling `Gaia.router.page('route', 'branch')`.

	When finding a matching branch, it also checks if all the required deeplink-parts are available in the passed deeplink object.

	When no match is found, it returns `"/"` to link to the home of the website.

<script type="syntaxhighlighter" class="brush: ts; type: example"><![CDATA[
Gaia.router.assemble('index/detail', {"id": 23, "slug": "foobar"});

// returns
"/detail/23/foobar"
]]>
</script>

<div class="bs-callout bs-callout-info">

#### Usage

		This method is called from within Gaia, and you probably won't use it yourself.

</div>

### Example

Todo full example.