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

  config.plugins.push(
    new MonacoWebpackPlugin()
  );

  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    'react-dom': '@hot-loader/react-dom'
  });

  config = rewireReactHotLoader(config, env);

  return config;
};