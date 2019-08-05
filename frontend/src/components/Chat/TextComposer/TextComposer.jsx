import React, { Component } from 'react';
import $ from 'jquery';
import './TextComposer.css';

class TextComposer extends Component {
  constructor(...args) {
    super(...args);

    this._elInput = null;
    this._isSendingMessage = false;
  }

  componentDidMount() {
    $(this._elInput).on('keydown', this._handleKeyInput);
  }

  componentWillUnmount() {
    $(this._elInput).off('keydown', this._handleKeyInput);
  }

  getInputValue() {
    return this._elInput.value;
  }

  clearInput() {
    this._elInput.value = '';
  }

  _handleKeyInput = (evt) => {
    const { code: keyCode } = evt;

    if (keyCode === 'Enter') {
      this._handleMessageSend();
    }
  }

  _handleMessageSend = async () => {
    try {
      const { onMessageSend } = this.props;
      if (typeof onMessageSend !== 'function') {
        throw new Error('No handleMessageSend handler');
      }

      if (this._isSendingMessage) {
        return;
      } else {
        this._isSendingMessage = true;
      }

      const messageBody = this.getInputValue();

      await onMessageSend(messageBody);

      // If message sends, reset the input
      this.clearInput();

      this._isSendingMessage = false;
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    return (
      <div className="zd-chat-text-composer">
        <div className="row">
          <div className="cell">
            <input
              ref={ c => this._elInput = c }
              placeholder="Enter a message"
            />
          </div>
          <div className="cell">
            <button onClick={this._handleMessageSend}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

export default TextComposer;