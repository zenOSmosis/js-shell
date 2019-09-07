import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import KeyboardLinkedState, { ACTION_HANDLE_KEY_DOWN, ACTION_HANDLE_KEY_UP } from 'state/KeyboardLinkedState';
import hocConnect from 'state/hocConnect';

/**
 * Note! This provider binds directly to the native window object, and is not
 * scoped directly for its descendants.
 * 
 * Importan!  This should be treated as a singleton!
 */
class DesktopKeyboardInterruptProvider extends Component {
  _keyboardLinkedState = null;

  componentDidMount() {
    const { keyboardLinkedState } = this.props;
    this._keyboardLinkedState = keyboardLinkedState;

    $(window).on('keydown', this._handleKeyDownEvent);
    $(window).on('keydown', this._handleKeyUpEvent);
  }

  componentWillUnmount() {
    $(window).off('keydown', this._handleKeyDownEvent);
    $(window).off('keydown', this._handleKeyUpEvent);
  }

  _handleKeyDownEvent = (evt) => {
    this._keyboardLinkedState.dispatchAction(ACTION_HANDLE_KEY_DOWN, evt);
  };

  _handleKeyUpEvent = (evt) => {
    this._keyboardLinkedState.dispatchAction(ACTION_HANDLE_KEY_UP, evt);
  };

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {
          children
        }
      </Fragment>
    )
  }
}

export default hocConnect(DesktopKeyboardInterruptProvider, KeyboardLinkedState, (updatedState, keyboardLinkedState) => {
  return {
    keyboardLinkedState
  };
});