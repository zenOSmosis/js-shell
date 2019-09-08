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
  }

  /**
   * Internally called when the mousedown or touchstart events are called.
   */
  _handleMouseOrTouchStart = (evt) => {
    const { shellDesktopProcess } = this.props;

    if (evt.target.parentNode === this._fullEl) {
      shellDesktopProcess.focus();
    }
  };

  render() {
    const { children, shellDesktopProcess, ...propsRest } = this.props;

    return (
      <Background
        {...propsRest}
      >
        {
          /**
           * Since <Background /> uses a couple of <Cover /> views, it's easier
           * to overlay it with a <Full /> view in order to capture mouse /
           * touch events.
           */
        }
        <Full
          ref={c => this._full = c}
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
  const { backgroundURL, shellDesktopProcess } = updatedState;

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