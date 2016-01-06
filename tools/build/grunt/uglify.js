module.exports = function (grunt, options)
{
	return {
		release:{
			options: {
				sourceMap: options.exportSourceMaps,
				sourceMapIncludeSources: true,
				sourceMapName: function(val) {
					return val.replace(/script/gi, 'sourcemap') + '.map';
				},
				compress: {
					global_defs: {
						RELEASE: true,
						DEBUG: false
					}
				},
				preserveComments: 'some'
			},
			files: [{
				expand: true,
				cwd: '<%= buildVersionDir %>/inc/script',
				src: '**/*.js',
				dest: '<%= buildVersionDir %>/inc/script'
	        }]
		}
	};
};