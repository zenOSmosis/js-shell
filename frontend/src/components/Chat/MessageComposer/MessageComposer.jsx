import React, { Component } from 'react';
import './MessageComposer.css';

class MessageComposer extends Component {
  constructor(...args) {
    super(...args);

    this._elInput = null;
    this._isSendingMessage = false;
  }

  /**
   * @return {string}
   */
  getInputValue() {
    return this._elInput.value;
  }

  clearInput() {
    this._elInput.value = '';
  }

  _handleKeyDown(evt) {
    const { keyCode } = evt;

    // Enter key
    if (keyCode === 13) {
      this._handleMessageSend();
    }
  }

  async _handleMessageSend() {
    try {
      const { onMessageSend } = this.props;
      if (typeof onMessageSend !== 'function') {
        throw new Error('No handleMessageSend handler');
      }

      if (this._isSendingMessage) {
        // TODO: Dispatch action to UI indicating a message is currently being sent

        console.warn('Sending of message ignored because the MessageComposer is currently in a sendingMessage state.');

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
              onKeyDown={evt => this._handleKeyDown(evt)}
            />
          </div>
          <div className="cell">
            <button onClick={evt => this._handleMessageSend()}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageComposer;