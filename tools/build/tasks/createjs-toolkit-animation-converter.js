var http = require("http");
var path = require('path');
var fs = require("fs");
var createjs_def = require('../grunt_tasks/createjs-def');

module.exports = function(grunt)
{

	// todo: copy from template files
	grunt.registerTask('createjs-toolkit-animation-converter', 'convert createjsToolkit animations to a AMD working version.', function()
	{
		console.log('grunt:createjs-toolkit-animations');

		var filePath = grunt.option('file');

		if(!filePath){

			var options = grunt.config('createjs-toolkit-animation-converter.options');

			if(!options.sourceDir){
				throw new Error('no sourceDir options defined');
			}

			if(!options.sourceAssets){
				throw new Error('no sourceAssets options defined');
			}

			if(!options.images){
				throw new Error('no images output dir defined in options');
			}

			if(!options.sound){
				throw new Error('no sound output dir defined in options');
			}

			if(!options.script){
				throw new Error('no script output dir defined in options');
			}

			var jsFiles = grunt.file.expand(options.sourceAssets);

			for(var i = 0; i < jsFiles.length; i++)
			{
				convertFile(jsFiles[i], options.sourceDir, options.images, options.sound, options.script);
			}
		} else {
			// normalize javascript file path.
//			filePath = path.normalize( filePath );
//			convertFile(filePath);
		}



	});

	function convertFile(jsFilePath, sourceDir, imageOutputRootPath, soundOutputRootPath, scriptOutputRootPath)
	{
		if( !isPathAJavascriptFile(jsFilePath) ){
			throw new Error('file has no javascript extension');
		}

		var jsFileName = getFileName(jsFilePath);
		var jsDirName = jsFilePath.replace(jsFileName, '');
		var fileName = jsFileName.replace(/\.js$/,'');
		var htmlFilePath = jsFilePath.replace(/\.js$/,'.html');

		var dtsFilePath = scriptOutputRootPath + '/' + jsFileName.replace(/\.js$/,'.d.ts');
		var tsAnimationFilePath = dtsFilePath.replace(/\.d\.ts$/,'Animation.ts');

		var jsFileData = fs.readFileSync(jsFilePath, "utf-8");
		var convertedFilePath = scriptOutputRootPath + '/' + jsFileName;
		var htmlFileData;
		var manifestAudio;
		var manifestImage;


//		if( !grunt.file.exists(convertedFilePath) )
//		{
			htmlFileData = fs.readFileSync(htmlFilePath, "utf-8");
			manifestAudio = createManifestObjectList(htmlFileData, 'audio');
			manifestImage = createManifestObjectList(htmlFileData, 'image');

			// put files in audio dir.
			if( manifestAudio.length > 0 ){
				for(var i = 0; i < manifestAudio.length; i++)
				{
					var src = manifestAudio[i].src;
					var dest = soundOutputRootPath + '/' + fileName + '/' + getFileName(src);
					grunt.file.copy( jsDirName + src, dest );

					manifestAudio[i].src = dest.replace(sourceDir, '');
				}

				grunt.file.write( soundOutputRootPath + '/' + fileName + '/manifest.json', JSON.stringify(manifestAudio) );
			}

			// put files in image dir.
			if( manifestImage.length > 0 ){
				for(var i = 0; i < manifestImage.length; i++)
				{
					var src = manifestImage[i].src;
					var dest = imageOutputRootPath + '/' + fileName + '/' + getFileName(src);
					grunt.file.copy( jsDirName + src, dest );

					manifestImage[i].src = dest.replace(sourceDir, '');
				}

				grunt.file.write( imageOutputRootPath + '/' + fileName + '/manifest.json', JSON.stringify(manifestImage) );
			}

			// put files in script dir.
			grunt.file.write( convertedFilePath, convertCreateJSToAMD(jsFileData) );
			grunt.file.write( dtsFilePath, createDefinitionFile(jsFileData, convertedFilePath) );
			grunt.file.write( tsAnimationFilePath, createAnimationFile(convertedFilePath.replace(sourceDir, ''), fileName) );


//		}

	}

	function isPathAJavascriptFile(src){
		return /\.js$/.test(src);
	}

	/**
	 * Check if fs file is converted already.
	 *
	 * @param string data
	 * @returns boolean
	 */
	function isJSFileConvertedToAMD(data)
	{
		return /define\(function/.test(data);
	}

	function getFileExtention(src){
		return /\.([\w]+)$/.exec(src)[0];
	}

	function getFileName(src){
		return /([\w]+\.[A-Za-z\d]+)$/g.exec(src)[0];
	}

	/**
	 * @todo make more dynamic
	 * @param fileName
	 * @param callback
	 * @returns string Definitionfile
	 */
	function createDefinitionFile(data, animation_path)
	{
		// @todo check if file is of correct format
		var jsp = createjs_def.parseJs;
		var ast = jsp.parse(data);

		var builder = createjs_def.model;
		var model = builder.parse(ast[1]);

		var formatter = createjs_def.formatter;
		var out = formatter['typescript'](model);

		var easelJSPath = path.relative(path.dirname(animation_path), "deploy/htdocs/inc/script/lib/createjs/easeljs.d.ts");
		out = out.replace("easeljs\/easeljs.d.ts", easelJSPath);

		animation_path = animation_path.replace('deploy/htdocs/inc/script/', '');
		animation_path = animation_path.replace(/\.js$/, '');

		out = out.replace("declare module lib", "declare module \"" + animation_path + "\"");

		return out;
	}

	function convertCreateJSToAMD(data){
		var return_data = "";

		return_data += "define(function(){ \n";
		return_data += "\n";
		return_data += "var lib = {};\n";
		return_data += "var images = {};\n";
		return_data += "lib.images = images;\n";
		return_data += "\n";
		return_data += data.replace('var lib, images, createjs;', 'var images;');
		return_data += "\n";
		return_data += "\n";
		return_data += "return lib;\n";
		return_data += "});";

		return return_data;
	}

	function createAnimationFile(animation_path, animation_name)
	{
		// check if filename has extension
		if( /\.ts$|\.js$/.test(animation_path) ){
			animation_path = animation_path.replace(/\.ts$|\.js$/, '');
		}

		animation_path = animation_path.replace(/^inc\/script\//, '');

		var return_data = "";

		return_data += "/**  Generated by:";
		return_data += "\n *   ________  ________  ___  ___  ________   _________        ________ _________  ________     ";
		return_data += "\n *  |\\   ____\\|\\   __  \\|\\  \\|\\  \\|\\   ___  \\|\\___   ___\\     |\\   ____\\\\___   ___\\\\   __  \\    ";
		return_data += "\n *  \\ \\  \\___|\\ \\  \\|\\  \\ \\  \\\\\\  \\ \\  \\\\ \\  \\|___ \\  \\_|     \\ \\  \\___\\|___ \\  \\_\\ \\  \\|\\  \\   ";
		return_data += "\n *   \\ \\  \\  __\\ \\   _  _\\ \\  \\\\\\  \\ \\  \\\\ \\  \\   \\ \\  \\       \\ \\  \\       \\ \\  \\ \\ \\   __  \\  ";
		return_data += "\n *    \\ \\  \\|\\  \\ \\  \\\\  \\\\ \\  \\\\\\  \\ \\  \\\\ \\  \\   \\ \\  \\       \\ \\  \\____   \\ \\  \\ \\ \\  \\ \\  \\ ";
		return_data += "\n *     \\ \\_______\\ \\__\\\\ _\\\\ \\_______\\ \\__\\\\ \\__\\   \\ \\__\\       \\ \\_______\\  \\ \\__\\ \\ \\__\\ \\__\\";
		return_data += "\n *      \\|_______|\\|__|\\|__|\\|_______|\\|__| \\|__|    \\|__|        \\|_______|   \\|__|  \\|__|\\|__|";
		return_data += "\n *";
		return_data += "\n *   Grunt createjs toolkit animations task";
		return_data += "\n */\n\n";

		return_data += "import refdef = require('lib/ReferenceDefinitions');\n";
		return_data += "import CreatejsAnimationHandler = require('lib/createjs/easeljs/component/createjstoolkit/CreatejsAnimationHandler');\n";
		return_data += "import lib = require('" + animation_path + "');\n";
		return_data += "\n";
		return_data += "class " + animation_name + "Animation extends CreatejsAnimationHandler {\n";
		return_data += "\n";
		return_data += "\tconstructor(){\n";
		return_data += "\t\tsuper(lib, '" + animation_name + "');\n";
		return_data += "\t}\n";
		return_data += "};\n";
		return_data += "\n";
		return_data += "export = " + animation_name + "Animation;";

		return return_data;
	}

	/**
	 * Create a manifest JSON for either image or audio assets
	 *  
	 * @param htmlData The html data that was generated by createjs toolkit
	 * @param assetType The asset type, either "image" or "audio"
	 * @returns any[] ObjectList that can be converted to json.
	 */
	function createManifestObjectList(htmlData, assetType)
	{
		if (assetType != "audio" && assetType != "image")
		{
			throw new Error("AssetType " + assetType + " is invalid. Should be either \"audio\" or \"image\".");
		}

		var createJSAssetType = (assetType == "audio") ? "sounds" : "images";

		var regexp = new RegExp("{src:\"" + createJSAssetType + ".*}", "g");
		var assetLines = htmlData.match(regexp);

		// adding quotes to make it valid json.
		for(var i = 0; i < assetLines.length; i++)
		{
			assetLines[i] = assetLines[i].replace(/src\:/g, '"src":').replace(/id\:/g, '"id":');
		}
//
		if (assetLines.length == 0)
		{
			return null;
		}

		var return_data = "";

		return_data += "[\n";
		return_data += assetLines.join(",");
		return_data += "\n]";

		return JSON.parse(return_data);
	}
}