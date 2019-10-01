import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import Message from '../Message';

class MessageList extends Component {
  render() {
    const { chatMessages } = this.props;

    if (!chatMessages) {
      return false;
    }

    let shouldScrollToBottom = true;

    /*
    // TODO: Implement ability to decide whether to scroll to bottom or not

    const lastMessage = chatMessages && chatMessages[chatMessages.length - 1];
    if (lastMessage) {
      const isFinalized = lastMessage.getIsFinalized();
      const isTyping = lastMessage.getIsTyping();

      if (isTyping || !isFinalized) {
        shouldScrollToBottom = false;
      }
    }
    */

    return (
      <Scrollable
        // TODO: Only scroll to bottom if the last message is finished being composed
        isScrollToBottom={shouldScrollToBottom}
      >
        {
          chatMessages.map((chatMessage, idx) => {
            return (
              <Message
                key={idx}
                chatMessage={chatMessage}
              />
            );
          })
        }
      </Scrollable>
    );
  }
}

export default MessageList;