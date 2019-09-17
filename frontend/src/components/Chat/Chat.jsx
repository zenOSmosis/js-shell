import React, { Component } from 'react';
import Full from '../Full';
import ChatHeader from './Header';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
// import createSocketPeerChatMessageDataPacket from 'utils/p2p/socket.io/createSocketPeerChatMessageDataPacket';
// import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';
import P2PLinkedState, { STATE_CACHED_CHAT_MESSAGES, ACTION_GET_CACHED_CHAT_MESSAGES } from 'state/P2PLinkedState';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import { getSocketID } from 'utils/socket.io';

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

  /*
  async _handleMessageSend(messageBody) {
    try {
      const { remoteSocketPeerID: toSocketPeerID } = this.props;

      const socketPeerDataPacket = createSocketPeerChatMessageDataPacket(toSocketPeerID, messageBody);

      await sendSocketPeerDataPacket(socketPeerDataPacket);
    } catch (exc) {
      throw exc;
    }
  }
  */

  render() {
    const { remoteSocketPeerID } = this.props;

    return (
      <LinkedStateRenderer
        key={remoteSocketPeerID}
        linkedState={this._p2pLinkedState}
        onUpdate={(updatedState) => {
          const { [STATE_CACHED_CHAT_MESSAGES]: stateChatMessages } = updatedState;

          if (stateChatMessages !== undefined) {
            // const localSocketID = getSocketID();

            const chatMessages = this._p2pLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGES, (testChatMessage) => {
              const testToSocketPeerID = testChatMessage.getToSocketPeerID();
              if (testToSocketPeerID === remoteSocketPeerID) {
                return true;
              } else {
                const testFromSocketPeerID = testChatMessage.getFromSocketPeerID();
                if (testFromSocketPeerID === remoteSocketPeerID) {
                  return true;
                }
              }
              
              return false;
            });

            const ret = {
              chatMessages
            };

            return ret;
          }
        }}
        render={(renderProps) => {
          const { chatMessages } = renderProps;

          console.debug({
            renderChatMessages: chatMessages
          });

          return (
            <Full style={{ backgroundColor: 'rgba(255,255,255,.2)' }}>
              <Layout>
                <Header>
                  <ChatHeader
                    // TODO: Rename to toSocketPeerID
                    remoteSocketPeerID={remoteSocketPeerID}
                  />
                </Header>

                <Content>
                  <MessageList chatMessages={chatMessages} />
                </Content>

                <Footer>
                  <MessageComposer
                    toSocketPeerID={remoteSocketPeerID}
                    // onMessageSend={messageBody => { this._handleMessageSend(messageBody) }}
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