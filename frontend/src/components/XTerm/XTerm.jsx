// This code was lifted from here because it is no longer being maintained there
// @see https://github.com/farfromrefug/react-xterm/blob/master/src/react-xterm.tsx

import React, { Component } from 'react';
import { Terminal } from 'xterm';
const className = require('classnames');
import('xterm/dist/xterm.css');

export default class Xterm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isFocused: false
    };

    this._xterm = null;
    this._container = null;
  }

  applyAddon(addon) {
    Terminal.applyAddon(addon);
  }

  componentDidMount() {
    // Apply addons
    const defaultAddons = ['fit', /*'winptyCompat',*/ 'attach'];
    const propsAddons = this.props.addons || [];
    const addons = [...defaultAddons, ...propsAddons];
    if (addons) {
      addons.forEach(s => {
        const addon = require(`xterm/dist/addons/${s}/${s}.js`);
        Terminal.applyAddon(addon);
      });
    }

    this._xterm = new Terminal(this.props.options);
    this._xterm.open(this._container);
    this._xterm.on('focus', this.focusChanged.bind(this, true));
    this._xterm.on('blur', this.focusChanged.bind(this, false));
    if (this.props.onContextMenu) {
      this._xterm.element.addEventListener('contextmenu', this.onContextMenu.bind(this));
    }
    if (this.props.onInput) {
      this._xterm.on('data', this.onInput);
    }
    if (this.props.value) {
      this._xterm.write(this.props.value);
    }
  }

  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this._xterm) {
      this._xterm.destroy();
      this._xterm = null;
    }
  }
  
  // componentWillReceiveProps(nextProps) {
  //     if (nextProps.hasOwnProperty('value')) {
  //         this.setState({ value: nextProps.value });
  //     }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate', nextProps.hasOwnProperty('value'), nextProps.value != this.props.value);
    if (nextProps.hasOwnProperty('value') && nextProps.value !== this.props.value) {
      if (this._xterm) {
        this._xterm.clear();
        setTimeout(() => {
          this._xterm.write(nextProps.value);
        }, 0)
      }
    }
    return false;
  }

  getTerminal() {
    return this._xterm;
  }

  write(data) {
    this._xterm && this._xterm.write(data);
  }

  writeUtf8(data) {
    this._xterm && this._xterm.writeUtf8(data);
  }

  writeln(data) {
    this._xterm && this._xterm.writeln(data);
  }

  focus() {
    if (this._xterm) {
      this._xterm.focus();
    }
  }

  focusChanged(focused) {
    this.setState({
      isFocused: focused
    });
    this.props.onFocusChange && this.props.onFocusChange(focused);
  }

  fit() {
    this._xterm.fit();
  }

  onInput = (data) => {
    this.props.onInput && this.props.onInput(data);
  };

  resize(cols, rows) {
    this._xterm && this._xterm.resize(Math.round(cols), Math.round(rows));
  }

  /**
   * 
   * @param {string} key 
   * @param {boolean} value 
   */
  setOption(key, value) {
    this._xterm && this._xterm.setOption(key, value);
  }

  refresh() {
    this._xterm && this._xterm.refresh(0, this._xterm.rows - 1);
  }

  onContextMenu(e) {
    this.props.onContextMenu && this.props.onContextMenu(e);
  }

  render() {
    const { ...propsRest } = this.props;

    const terminalClassName = className('ReactXTerm', this.state.isFocused ? 'ReactXTerm--focused' : null, this.props.className);
    return <div
      {...propsRest}
      ref={ref => (this._container = ref)}
      className={terminalClassName}
      style={{ width: '100%', height: '100%' }}
    />;
  }
}