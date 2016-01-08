module.exports = function( grunt )
{
	grunt.registerMultiTask(
		'create-xmlp',
		'Wrap *.xml files in *.xmlp',
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
				fileContent = fileName + '("' + encodeURIComponent( fileContent ) + '");';

				// Log progress
				grunt.log.writeln( 'Generating "' + f.dest + '"' );

				// Create new *.XMLP file
				grunt.file.write( f.dest, fileContent );
			} );
		}
	);

	function getFileName( path )
	{
		return path.split( '/' ).pop().split( '.' )[0];
	}
};