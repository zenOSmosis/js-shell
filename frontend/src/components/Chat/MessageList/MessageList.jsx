import React, { Component } from 'react';
import Scrollable from 'components/Scrollable';
import Message from '../Message';

class MessageList extends Component {
  render() {
    return (
      <Scrollable>
        <Message
          fromLocal={false}
        >
          Hi from remote user!
        </Message>

        <Message
          fromLocal={true}
        >
          Hi from local user!
        </Message>
      </Scrollable>
    );
  }
}

export default MessageList;