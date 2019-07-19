// @see https://github.com/zertosh/v8-compile-cache#readme
// @see [further reading] https://medium.com/@felixrieseberg/javascript-on-the-desktop-fast-and-slow-2b744dfb8b55
require('v8-compile-cache');

// Override create-react-app webpack configs without ejecting
// @see https://github.com/timarney/react-app-rewired

// @see https://github.com/Microsoft/monaco-editor/issues/82
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// @see https://dariosky.github.io/2018/08/05/add-proper-hot-reload-to-create-react-app/
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  // @see https://github.com/Microsoft/monaco-editor/issues/82
  config.plugins.push(
    new MonacoWebpackPlugin()
  );

  // Configure hot loading
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    'react-dom': '@hot-loader/react-dom'
  });
  config = rewireReactHotLoader(config, env);

  // @see https://medium.com/@danilog1905/how-to-use-web-workers-with-react-create-app-and-not-ejecting-in-the-attempt-3718d2a1166b
  // @see https://www.npmjs.com/package/worker-loader
  config.module.rules.push({
    test: /\.worker\.js$/,
    loader: 'worker-loader',
    options: {
      name: 'native-worker.[hash].js', // Set a custom name for the output script
      inline: false // Inline the worker as a BLOB
    }
  });

  // Fix window not defined error in worker
  // TODO: Cite why this is needed
  // @see https://medium.com/@vincentdnl/just-did-all-the-steps-in-the-article-on-a-fresh-cra-install-and-i-get-a-referenceerror-window-is-e200541533d0
  config.output['globalObject'] = 'this';

  // Echo config, for debug purposes
  console.log('Webpack config w/ overrides @ config-overrides.js', {
    config,
    env
  });

  return config;
};