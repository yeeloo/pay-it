module.exports = function( grunt )
{
	grunt.registerMultiTask(
		'create-jsonp',
		'Wrap *.json files in *.jsonp',
		function()
		{
			// Loop through files
			this.files.forEach( function( f )
			{
				var filePath = f.src[0];
				var fileName = getFileName( filePath );

				// Read original data
				var fileContent = grunt.file.read( filePath );

				// Create new file content
				fileContent = fileName + '(' + fileContent + ');';

				// Log progress
				grunt.log.writeln( 'Generating "' + f.dest + '"' );

				// Create new *.JSONP file
				grunt.file.write( f.dest, fileContent );
			} );
		}
	);

	function getFileName( path )
	{
		return path.split( '/' ).pop().split( '.' )[0];
	}
};