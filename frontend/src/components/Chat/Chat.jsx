import React, { Component } from 'react';
import Full from '../Full';
import ChatHeader from './Header';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import createSocketPeerChatMessageDataPacket from 'utils/p2p/socket.io/createSocketPeerChatMessageDataPacket';
import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';

/**
 * @typedef {Object} ChatMessage
 * @property {boolean} isFromLocalUser
 * @property {string} body
 * @property {number} sendTime Unix time of message sent
 * @property {boolean} isReceived
 */

class Chat extends Component {
  state = {
    messages: []
  };

  async _handleMessageSend(messageBody) {
    try {
      const { remoteSocketPeerID: toSocketPeerID } = this.props;

      const socketPeerDataPacket = createSocketPeerChatMessageDataPacket(toSocketPeerID, messageBody);

      await sendSocketPeerDataPacket(socketPeerDataPacket);
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { remoteSocketPeerID } = this.props;
    const { messages } = this.state;

    return (
      <Full style={{ backgroundColor: 'rgba(255,255,255,.2)' }}>
        <Layout>
          <Header>
             <ChatHeader
              remoteSocketPeerID={remoteSocketPeerID}
            />
          </Header>

          <Content>
             <MessageList messages={messages} />
          </Content>

          <Footer>
            <MessageComposer
              onMessageSend={messageBody => { this._handleMessageSend(messageBody) }}
            />
          </Footer>
        </Layout>
      </Full>
    );
  }
}

export default Chat;