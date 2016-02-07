module.exports = {
    entry:  './src',
    resolve: {
    	extensions: ['', '.js', '.jsx']
  	},
    output: {
        path:     'builds',
        filename: 'bundle.js',
    },
	module: {
        loaders: [
        {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need something
        // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
        loaders: ['babel?cacheDirectory'],
        include: __dirname + '/src',
      }
        ],
    }
};