import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import Message from '../Message';

class MessageList extends Component {
  render() {
    const { chatMessages } = this.props;

    return (
      <Scrollable
        isScrollToBottom={true}
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