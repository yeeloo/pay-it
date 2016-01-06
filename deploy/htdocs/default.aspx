<%@ Page Language="C#" %>
<script runat="server">
private string basepath()
{
	string url = Request.Url.AbsoluteUri;
	string me = "default.aspx";
	string basepath = url.Remove(url.IndexOf(me), me.Length);
	return basepath;
}
</script>

<!doctype html>
<!--[if IE 8]> <html class="no-js lt-ie10 lt-ie9"> <![endif]-->
<!--[if IE 9]><html class="no-js lt-ie10"><![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" />

	<title>MediaMonks</title>

    <!-- this is used for history, absolute uri to your 'index' -->
	<meta name="document-base" content="<%=basepath()%>" />

	<!-- change this path to cdn or append version folder -->
	<base href="<%=basepath()%>version/src/" />

	<link href="inc/style/screen.css" rel="stylesheet" type="text/css" />

	<script src="inc/script/vendor/modernizr/modernizr.js"></script>
</head>
<body data-gaia-container="main">

    <!-- build:js inc/script/app/bundle.js -->
	<script src="inc/script/vendor/require/require.js"></script>
	<script src="inc/script/app/Bootstrap.js"></script>
    <!-- endbuild -->

</body>
</html>