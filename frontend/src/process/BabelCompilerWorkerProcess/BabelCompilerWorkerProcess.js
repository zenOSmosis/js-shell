import ClientWorkerProcess from '../ClientWorkerProcess/ClientWorkerProcess';
const Babel = require('babel-standalone'); // babel-standalone is not an ES6 module
import React from 'react';
import ReactDOM from 'react-dom';

export const BABEL_REACT_PRESETS = [
  'react',
  'es2015',
  // 'transform-require-context'
];

export default class BabelCompilerWorkerProcess extends ClientWorkerProcess {
  constructor(...args) {
    super(...args);

    console.debug({
      compilerLibaries: {
        Babel,
        React,
        ReactDOM
      }
    });

    this.stdctrl.on('data', data => {
      const { ctrlName } = data;
      if (ctrlName === 'compile') {
        const { ctrlData: rawCode } = data;
        const compiledCode = this.compile(rawCode);

        this.stdctrl.write({
          ctrlName: 'compiledCode',
          ctrlData: compiledCode
        });
      }
    });
  }

  /**
   * @param {String} code
   * @return {String} Transformed output 
   */
  compile(code) {
    // Pre-process
    // Weird hack to retain "this" keyword passing through compiler, or else all
    // "this" references are compiled as "undefined"
    // TODO: This needs extensive testing and is probably a very terrible hack
    code = `
      const ___this___ = {};
      ${code}
    `.split('this').join('___this___');

    // TODO: Finish proto/compiler.js
    // TODO: Remove Babel include in index.html
    console.warn('TODO: Move code compilation to separate thread. Remove Babel compiler script inclusion from index.html');

    let compiledCode = Babel.transform(code, {
      // TODO: Make presets adjustable
      presets: BABEL_REACT_PRESETS
    }).code;

    // Post-process
    compiledCode = compiledCode.split('___this___').join('this');
    // Remove compiled version of this (if targeting es2015)
    compiledCode = compiledCode.split('var ___this___ = {};').join('');

    // TODO: Generate dynamic code headers
    console.debug('compiled code:\n--------------\n', compiledCode);

    return compiledCode;
  }
}