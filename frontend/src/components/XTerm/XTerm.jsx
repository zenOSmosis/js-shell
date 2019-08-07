// This code was lifted from here
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

    this.xterm = null;
    this.container = null;
  }

  applyAddon(addon) {
    Terminal.applyAddon(addon);
  }

  componentDidMount() {
    const defaultAddons = ['fit', /*'winptyCompat',*/ 'attach'];

    const propsAddons = this.props.addons || [];

    const addons = [...defaultAddons, ...propsAddons];

    if (addons) {
      addons.forEach(s => {
        const addon = require(`xterm/dist/addons/${s}/${s}.js`);
        Terminal.applyAddon(addon);
      });
    }

    this.xterm = new Terminal(this.props.options);
    this.xterm.open(this.container);
    this.xterm.on('focus', this.focusChanged.bind(this, true));
    this.xterm.on('blur', this.focusChanged.bind(this, false));
    if (this.props.onContextMenu) {
      this.xterm.element.addEventListener('contextmenu', this.onContextMenu.bind(this));
    }
    if (this.props.onInput) {
      this.xterm.on('data', this.onInput);
    }
    if (this.props.value) {
      this.xterm.write(this.props.value);
    }
  }

  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.xterm) {
      this.xterm.destroy();
      this.xterm = null;
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
      if (this.xterm) {
        this.xterm.clear();
        setTimeout(() => {
          this.xterm.write(nextProps.value);
        }, 0)
      }
    }
    return false;
  }

  getTerminal() {
    return this.xterm;
  }

  write(data) {
    this.xterm && this.xterm.write(data);
  }

  writeln(data) {
    this.xterm && this.xterm.writeln(data);
  }

  focus() {
    if (this.xterm) {
      this.xterm.focus();
    }
  }

  focusChanged(focused) {
    this.setState({
      isFocused: focused
    });
    this.props.onFocusChange && this.props.onFocusChange(focused);
  }

  fit() {
    this.xterm.fit();
  }

  onInput = (data) => {
    this.props.onInput && this.props.onInput(data);
  };

  resize(cols, rows) {
    this.xterm && this.xterm.resize(Math.round(cols), Math.round(rows));
  }

  /**
   * 
   * @param {string} key 
   * @param {boolean} value 
   */
  setOption(key, value) {
    this.xterm && this.xterm.setOption(key, value);
  }

  refresh() {
    this.xterm && this.xterm.refresh(0, this.xterm.rows - 1);
  }

  onContextMenu(e) {
    this.props.onContextMenu && this.props.onContextMenu(e);
  }

  render() {
    const { ...propsRest } = this.props;

    const terminalClassName = className('ReactXTerm', this.state.isFocused ? 'ReactXTerm--focused' : null, this.props.className);
    return <div
      {...propsRest}
      ref={ref => (this.container = ref)}
      className={terminalClassName}
      style={{ width: '100%', height: '100%' }}
    />;
  }
}