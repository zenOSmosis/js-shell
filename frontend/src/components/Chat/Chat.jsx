import React, { Component } from 'react';
import Full from '../Full';
import ChatHeader from './Header';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import createSocketPeerChatMessageDataPacket from 'utils/p2p/socket.io/createSocketPeerChatMessageDataPacket';
import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';
import P2PLinkedState, { STATE_CHAT_MESSAGES, ACTION_GET_CHAT_MESSAGES } from 'state/P2PLinkedState';
import LinkedStateRenderer from 'components/LinkedStateRenderer';

/**
 * @typedef {Object} ChatMessage
 * @property {boolean} isFromLocalUser
 * @property {string} body
 * @property {number} sendTime Unix time of message sent
 * @property {boolean} isReceived
 */

class Chat extends Component {
  constructor(props) {
    super(props);

    this._p2pLinkedState = new P2PLinkedState();
  }

  componentWillUnmount() {
    this._p2pLinkedState.destroy();
    this._p2pLinkedState = null;
  }

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

    return (
      <LinkedStateRenderer
        linkedState={this._p2pLinkedState}
        onUpdate={(updatedState) => {
          const { [STATE_CHAT_MESSAGES]: stateChatMessages } = updatedState;

          if (stateChatMessages !== undefined) {
            const ret = {
              messages: this._p2pLinkedState.dispatchAction(ACTION_GET_CHAT_MESSAGES, (chatMessage) => {
                const { fromSocketPeerID: testFromSocketPeerID } = chatMessage;

                return testFromSocketPeerID === remoteSocketPeerID;
              })
            };

            console.debug({
              ret
            });

            return ret;
          }
        }}
        render={(renderProps) => {
          const { messages } = renderProps;

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
          )
        }}
      />
    );
  }
}

export default Chat;