module.exports = function (grunt) {

	grunt.registerMultiTask('crowdin-get', 'Exports and download the Crowdin Translations', function () {
		var http = require("http"), fs = require("fs");

		var done = this.async();

		var projectId = grunt.config('crowdin-get.options.projectId');
		var projectKey = grunt.config('crowdin-get.options.projectKey');
		var languages = grunt.config('crowdin-get.options.languages');

		var exportData = function () {
			grunt.log.writeln('Exporting...');

			var postdata = "";
			var options = {
				host: 'api.crowdin.net',
				port: 80,
				path: '/api/project/' + projectId + '/export?key=' + projectKey + '&json',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': postdata.length
				}
			};

			grunt.log.writeln(options.path);

			var req = http.request(options, function (res) {
				//				grunt.log.writeln('STATUS: ' + res.statusCode);
				//				grunt.log.writeln('HEADERS: ' + JSON.stringify(res.headers));

				res.setEncoding('utf8');

				res.on('data', function (chunk) {
					grunt.log.writeln('Export result: ' + chunk);
					downloadData();
				});
			});

			req.on('error', function (e) {
				grunt.log.writeln('Export error: ' + e.message);
				done();
			});

			// write data to request body
			req.write(postdata);
			req.end();
		}

		var downloadData = function () {
			grunt.log.writeln('Downloading...');

			var options = {
				host: 'api.crowdin.net',
				port: 80,
				path: '/api/project/' + projectId + '/download/' + languages + '.zip?key=' + projectKey
			};

			http.get(options,function (res) {
				//				grunt.log.writeln('STATUS: ' + res.statusCode);
				//				grunt.log.writeln('HEADERS: ' + JSON.stringify(res.headers));

				var fileData = '';

				res.setEncoding('binary');

				res.on('data', function (chunk) {
					fileData += chunk
				});

				res.on('end', function () {
					var filenameZip = languages + '.zip';

					fs.writeFile(filenameZip, fileData, 'binary', function (err) {
						grunt.log.writeln('Downloaded!');

						var AdmZip = require('adm-zip');
						var zip = new AdmZip(filenameZip);

						zip.extractAllTo('translations/', true);

						fs.unlinkSync(filenameZip)
						done();
					});
				});

			}).on('error', function (e) {
					grunt.log.writeln("Download error: " + e.message);
					done();
				})
		}

		exportData();
	});

	// custom task
	grunt.registerMultiTask('crowdin-update', 'Uploads new Crowdin Translations', function () {
		var done = this.async();

		var projectId = grunt.config('crowdin-update.options.projectId');
		var projectKey = grunt.config('crowdin-update.options.projectKey');

		var http = require("http");

		var updateData = function () {
			grunt.log.writeln('Exporting...');

			//			var querystring = require('querystring');
			//
			//			var filedata = grunt.file.read('translations/nl/en_GB.json');
			//			var boundaryKey = Math.random().toString(16);
			//
			//			var postdata = querystring.stringify({
			//				'files["en_GB.json"]': filedata
			//			});
			//
			//			grunt.log.writeln("postdata: ", postdata);
			//
			//
			//			var options = {
			//				host: 'api.crowdin.net',
			//				port: 80,
			//				path: '/api/project/' + projectId + '/update-file?key=' + projectKey + '&json',
			//				method: 'POST',
			//				headers: {
			//					'Content-Type': 'multipart/form-data; boundary="'+boundaryKey+'"',
			//					'Content-Length': filedata.length
			//				}
			//			};
			//
			//			grunt.log.writeln(options.path);
			//
			//			var req = http.request(options, function(res)
			//			{
			////				grunt.log.writeln('STATUS: ' + res.statusCode);
			////				grunt.log.writeln('HEADERS: ' + JSON.stringify(res.headers));
			//
			//				res.setEncoding('utf8');
			//
			//				res.on('data', function (chunk) {
			//					grunt.log.writeln('Export result: ' + chunk);
			//					done();
			//				});
			//			});
			//
			//			req.on('error', function(e) {
			//				grunt.log.writeln('Export error: ' + e.message);
			//				done();
			//			});
			//
			//			// write data to request body
			//			req.write('--' + boundaryKey + '\r\n'
			//				// use your file's mime type here, if known
			//				+ 'Content-Type: text/json\r\n'
			//				// "name" is the name of the form field
			//				// "filename" is the name of the original file
			//				+ 'Content-Disposition: form-data; name="en_GB"; filename="en_GB.json"\r\n'
			//				+ 'Content-Transfer-Encoding: binary\r\n\r\n' );
			//
			//			req.write(filedata);
			//			req.end('\r\n--' + boundaryKey + '--');


			var request = require('request');
			var util = require('util');
			var fs = require('fs');

			//			console.log(fs.statSync('translations/nl/en_GB.json').size);

			var options = {
				//				'uri': 'http://api.crowdin.net/upload/api/project/' + projectId + '/update-file?key=' + projectKey + '&json'
				'uri': 'http://localhost:8888/_projects/_libraries/frontend/_svn/skeleton-gaia/tools/build/test.php'
				//				'headers': {
				//					'Content-Length': fs.statSync('translations/nl/en_GB.json').size
				//				}
			};
			var r = request.post(options, function (error, response, body) {
				grunt.log.writeln(body);
				done();
			});
			var form = r.form();
			form.append('foo', 'bar');
			form.append('files[en_GB.json]', fs.createReadStream('translations/nl/en_GB.json'));
		}

		updateData();
	});
}