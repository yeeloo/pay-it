var express = require('express');
var path = require('path');
var app = express();

// Note: i think there is a better way to do this
// I could get the grunt sourceDir but i don't have the grunt object available here.
var source = path.resolve(__dirname, '../../../../', 'deploy/htdocs/');

app.set('view engine', 'ejs');
app.use(express.static(source));

app.get('*', function(req, res)
{
	res.render(__dirname + '/' + 'index', { basePath: basePath(req) });
});

function basePath(req)
{
	var protocol = 'http://';
	var basePath = '';

	if(req.connection.encrypted)
	{
		protocol = 'https://';
	}

	basePath += protocol;
	basePath += req.headers.host;
	basePath += '/';

	return basePath;
}

module.exports = app;
