const { execFileSync } = require('child_process');

process.env.REACT_APP_SHELL_UI_BUILD_INFO = (() => {
  // This must run synchronously
  const gitSignature = execFileSync('../scripts/./echo-git-public-signature.sh').toString();

  const data = {
    gitSignature
  };

  console.log('Exporting REACT_APP_SHELL_BUILD_INFO', data);

  return JSON.stringify(data);
})();

const WorkerPlugin = require('worker-plugin');

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

  // Utilize HMR hot loading
  if (process.env.NODE_ENV === 'development') {
    (() => {
      // Overwrite react-dom w/ hot loader
      config.resolve.alias = Object.assign({}, config.resolve.alias, {
        'react-dom': '@hot-loader/react-dom'
      });

      // Overwrite the exiting config w/ the hot loader configuration
      config = rewireReactHotLoader(config, env);
    })();
  }

  // config.resolveLoader.modules = ["node_modules", "web_loaders"];

  /*
  config.module.rules.push({
    test: /\.worker\.js$/,
    loader: 'worker-plugin-loader',
    options: {
      // name: 'native-worker.[hash].js', // Set a custom name for the output script
      // inline: false // Inline the worker as a BLOB
    }
  });
  */

  /*
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
  */

  // Fix window not defined error in Web Worker
  // @see https://medium.com/@vincentdnl/just-did-all-the-steps-in-the-article-on-a-fresh-cra-install-and-i-get-a-referenceerror-window-is-e200541533d0
  // config.output['globalObject'] = 'this';

  config.plugins.push(
    new WorkerPlugin({
      // use "self" as the global object when receiving hot updates.
      globalObject: 'self', // <-- this is the default value
      filename: '[name].worker.js'
    })
  );

  // @see https://github.com/Microsoft/monaco-editor/issues/82
  config.plugins.push(
    new MonacoWebpackPlugin()
  );

  /*
  if (!config.externals) {
    config.externals = {};
  };
  config.externals = {...config.externals, {
    ...newExternals
  }};
  */

  // Echo config, for debug purposes
  // Note: This should come last, if echoing complete config
  console.log('Webpack config w/ overrides @ config-overrides.js', {
    config,
    env
  });

  return config;
};