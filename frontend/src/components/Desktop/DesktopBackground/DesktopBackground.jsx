import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Full from 'components/Full';
import Background from 'components/Background';
import DesktopLinkedState, {
  STATE_BACKGROUND_URL,
  STATE_BACKGROUND_COMPONENT,
  STATE_SHELL_DESKTOP_PROCESS
} from 'state/DesktopLinkedState';
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
    const { [STATE_SHELL_DESKTOP_PROCESS]: shellDesktopProcess } = this.props;

    if (evt.target.parentNode === this._fullEl) {
      shellDesktopProcess.focus();
    }
  };

  render() {
    const { children, src, shellDesktopProcess, ...propsRest } = this.props;

    return (
      <Background
        src={src}
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
  const {
    [STATE_BACKGROUND_URL]: backgroundUrl,
    [STATE_BACKGROUND_COMPONENT]: backgroundComponent,
    [STATE_SHELL_DESKTOP_PROCESS]: shellDesktopProcess
  } = updatedState;

  const filteredState = {};

  if (backgroundUrl !== undefined) {
    filteredState.src = backgroundUrl;
  }

  if (backgroundComponent !== undefined && backgroundComponent !== null) {
    filteredState.src = backgroundComponent;
  }

  if (shellDesktopProcess !== undefined) {
    filteredState[STATE_SHELL_DESKTOP_PROCESS] = shellDesktopProcess;
  }

  if (Object.keys(filteredState).length) {
    return filteredState;
  }
});