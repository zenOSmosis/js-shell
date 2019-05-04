// Override create-react-app webpack configs without ejecting
// @see https://github.com/timarney/react-app-rewired

// @see https://github.com/Microsoft/monaco-editor/issues/82
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }
  config.plugins.push(
    new MonacoWebpackPlugin()
  );
  return config;
};