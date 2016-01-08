module.exports = function(grunt)
{
	grunt.registerTask('server', 'Serve the Skeleton with Express', function (n)
	{
		var http = require('http');
		var path = require('path');
		var open = require('open');
		var index = __dirname + '/server/index.js';
		var app = require(index);
		var port = grunt.option('port') || 3333;

		var listener = http.createServer(app).listen(port, function ()
		{
			console.log('Express server listening on port ' + port);

			open('http://localhost:' + port);
		});

		listener.on('error', function(error)
		{
			if(error.code === 'EADDRINUSE')
			{
				grunt.log.writeln('Port ' + port + ' in use');

				return;
			}

			grunt.fatal(error);
		});

		this.async();
	});
};

