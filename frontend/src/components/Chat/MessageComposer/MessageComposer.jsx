import React, { Component } from 'react';
import ChatMessage from 'utils/p2p/ChatMessage.class';
import styles from './MessageComposer.module.scss';
import PropTypes from 'prop-types';

class MessageComposer extends Component {
  static propTypes = {
    toPeerId: PropTypes.string.isRequired
  };

  constructor(...args) {
    super(...args);

    this._elInput = null;
    this._isSendInProgress = false;

    this._currentChatMessage = null;
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
    const { toPeerId } = this.props;
    const { keyCode } = evt;

    // Start a new chat message, if one is not already present
    if (!this._currentChatMessage) {
      this._currentChatMessage = new ChatMessage(toPeerId);
    }

    // Enter key
    if (keyCode === 13) {
      this._handleMessageSend();
    } else {
      this._currentChatMessage.setIsTyping(true);
    }
  }

  async _handleMessageSend() {
    try {
      const messageBody = this.getInputValue().trim();

      // Prevent empty messages
      if (!messageBody.length) {
        return;
      }

      if (!this._currentChatMessage) {
        console.error('No current ChatMessage present. Ignoring _handleMessageSend() request.');
        return;
      }

      if (this._isSendInProgress) {
        // TODO: Dispatch action to UI indicating a message is currently being sent

        console.warn('Sending of message ignored because the MessageComposer is currently in a sendingMessage state.');
        return;
      }
      
      this._isSendInProgress = true;

      await this._currentChatMessage.finalizeAndSendMessage(messageBody);

      this._currentChatMessage = null;

      // If message sends, reset the input
      this.clearInput();

      this._isSendInProgress = false;
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    return (
      <div className={styles['message-composer']}>
        <div className={styles['row']}>
          <div className={styles['cell']}>
            <input
              ref={ c => this._elInput = c }
              placeholder="Enter a message"
              onKeyDown={evt => this._handleKeyDown(evt)}
            />
          </div>
          <div className={styles['cell']}>
            <button onClick={evt => this._handleMessageSend()}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageComposer;