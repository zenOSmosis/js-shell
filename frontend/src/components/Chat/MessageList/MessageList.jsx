import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import Message from '../Message';

class MessageList extends Component {
  render() {
    const { messages } = this.props;

    return (
      <Scrollable>
        {
          messages.map((message, idx) => {
            const { isFromLocal, body } = message;

            return (
              <Message
                key={idx}
                isFromLocal={isFromLocal}
              >
                {body}
              </Message>
            );
          })
        }
      </Scrollable>
    );
  }
}

export default MessageList;