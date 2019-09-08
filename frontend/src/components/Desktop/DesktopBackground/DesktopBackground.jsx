import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Full from 'components/Full';
import Background from 'components/Background';
import DesktopLinkedState from 'state/DesktopLinkedState';
import hocConnect from 'state/hocConnect';

class DesktopBackground extends Component {
  constructor(props) {
    super(props);

    this._full = null;
    this._fullEl = null;
  }

  componentDidMount() {
    this._fullEl = ReactDOM.findDOMNode(this._full);

    // this._fullEl.addEventListener('mousedown', this._handleMouseOrTouchStart);
    // this._fullEl.addEventListener('touchstart', this._handleMouseOrTouchStart);
  }

  componentWillUnmount() {
    // this._fullEl.removeEventListener('mousedown', this._handleMouseOrTouchStart);
    // this._fullEl.removeEventListener('touchstart', this._handleMouseOrTouchStart);
  }

  _handleMouseOrTouchStart = (evt) => {
    const { shellDesktopProcess } = this.props;

    console.debug({
      target: evt.target,
      fullEl: this._fullEl
    });

    if (evt.target.parentNode === this._fullEl) {
      /*
      console.debug({
        _handleMouseOrTouchStart: evt
      });
      */

      shellDesktopProcess.focus();
    }
  };

  render() {
    const { children, shellDesktopProcess, ...propsRest } = this.props;

    return (
      <Background
        { ...propsRest }
      >
        <Full
          ref={ c => this._full = c }
          onMouseDown={this._handleMouseOrTouchStart}
          onTouchStart={this._handleMouseOrTouchStart}
        >
          {
            children
          }
        </Full>
      </Background>
    )
  }
}

export default hocConnect(DesktopBackground, DesktopLinkedState, (updatedState) => {
  const {backgroundURL, shellDesktopProcess} = updatedState;

  const filteredState = {};

  if (backgroundURL) {
    filteredState.src = backgroundURL;
  }

  if (shellDesktopProcess) {
    filteredState.shellDesktopProcess = shellDesktopProcess
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});