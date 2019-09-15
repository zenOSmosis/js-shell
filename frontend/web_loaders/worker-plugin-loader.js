const WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const loaderUtils = require('loader-utils');

const getWorker = (file, content, options) => {
  const publicPath = options.publicPath
    ? JSON.stringify(options.publicPath)
    : '__webpack_public_path__';

  const publicWorkerPath = `${publicPath} + ${JSON.stringify(file)}`;

  /*
  if (options.inline) {
    const InlineWorkerPath = JSON.stringify(
      `!!${path.join(__dirname, 'InlineWorker.js')}`
    );

    const fallbackWorkerPath =
      options.fallback === false ? 'null' : publicWorkerPath;

    return `require(${InlineWorkerPath})(${JSON.stringify(
      content
    )}, ${fallbackWorkerPath})`;
  }
  */

  return `new Worker(${publicWorkerPath})`;
};

/**
 * @see https://github.com/GoogleChromeLabs/worker-plugin
 * @see https://webpack.js.org/api/loaders/#thisresourcepath
 */
module.exports = {
  pitch: function (request) {
    const options = loaderUtils.getOptions(this) || {};

    /*
    console.warn({
      context: this
    });
    */

    const cb = this.async();

    const filename = loaderUtils.interpolateName(
      this,
      options.name || '[hash].worker.js',
      {
        context: options.context || this.rootContext || this.options.context,
        regExp: options.regExp,
      }
    );
  
    const worker = {};
  
    worker.options = {
      filename,
      chunkFilename: `[id].${filename}`,
      namedChunkFilename: null,
    };
  
    // @see https://github.com/webpack-contrib/worker-loader/blob/master/src/index.js#L56
    worker.compiler = this._compilation.createChildCompiler('worker', worker.options);

    // TODO: Document
    new WebWorkerTemplatePlugin(worker.options).apply(worker.compiler);

    /*
    if (this.target !== 'webworker' && this.target !== 'web') {
      new NodeTargetPlugin().apply(worker.compiler);
    }
    */

    // TODO: Document
    new SingleEntryPlugin(this.context, `!!${request}`, 'main').apply(
      worker.compiler
    );

    const subCache = `subcache ${__dirname} ${request}`;

    worker.compilation = (compilation) => {
      if (compilation.cache) {
        if (!compilation.cache[subCache]) {
          compilation.cache[subCache] = {};
        }

        compilation.cache = compilation.cache[subCache];
      }
    };

    if (worker.compiler.hooks) {
      const plugin = { name: 'WorkerLoader' };
  
      worker.compiler.hooks.compilation.tap(plugin, worker.compilation);
    } else {
      worker.compiler.plugin('compilation', worker.compilation);
    }

    worker.compiler.runAsChild((err, entries, compilation) => {
      // throw err;

      // if (err) return cb(err);
      if (err) {
        throw err;
      }

      if (entries[0]) {
        worker.file = entries[0].files[0];
  
        worker.factory = getWorker(
          worker.file,
          compilation.assets[worker.file].source(),
          options
        );
  
        if (options.fallback === false) {
          delete this._compilation.assets[worker.file];
        }
  
        return cb(
          null,
          // `module.exports = function() {\n  return ${worker.factory};\n};`
          `module.exports = function() {
            return ${worker.factory}
          };`
        );
      }
  
      return cb(null, null);
    });
  }
};