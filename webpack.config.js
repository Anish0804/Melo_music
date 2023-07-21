const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with the entry point of your application
  
  module: {
    rules: [
      // Add loaders for different file types here
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      }
    ]
  },
  // Add other configuration options as needed
};
