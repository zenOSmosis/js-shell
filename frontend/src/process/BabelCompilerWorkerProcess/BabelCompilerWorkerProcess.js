import ClientWorkerProcess from '../ClientWorkerProcess/ClientWorkerProcess';
const Babel = require('@babel/standalone'); // @babel/standalone is not an ES6 module
import React from 'react';
import ReactDOM from 'react-dom';

// TODO: Enable optional passing of presets from controller
export const BABEL_REACT_PRESETS = [
  'react',
  'es2015'
];

export default class BabelCompilerWorkerProcess extends ClientWorkerProcess {
  constructor(...args) {
    super(...args);

    // TODO: Remove
    console.debug({
      compilerLibaries: {
        Babel,
        React,
        ReactDOM
      }
    });

    // TODO: Utilize constants for ctrlNames and/or leave it up to
    // implementation to handle control messages
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
   * @param {string} code The code to compile
   * @return {string} Transformed output 
   */
  compile(code) {
    let compiledCode = Babel.transform(code, {
      // TODO: Make presets adjustable
      presets: BABEL_REACT_PRESETS,
      sourceType: 'script'
    }).code;

    console.debug('compiled code:\n--------------\n\n', compiledCode);

    return compiledCode;
  }
}