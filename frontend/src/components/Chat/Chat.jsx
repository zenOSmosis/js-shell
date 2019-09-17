import React, { Component } from 'react';
import Full from '../Full';
import ChatHeader from './Header';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import createSocketPeerChatMessageDataPacket from 'utils/p2p/socket.io/createSocketPeerChatMessageDataPacket';
import sendSocketPeerDataPacket from 'utils/p2p/socket.io/sendSocketPeerDataPacket';
import P2PLinkedState, { STATE_CACHED_DATA_PACKETS, ACTION_GET_CACHED_DATA_PACKETS } from 'state/P2PLinkedState';
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
          const { [STATE_CACHED_DATA_PACKETS]: stateChatMessages } = updatedState;

          if (stateChatMessages !== undefined) {
            const localSocketID = getSocketID();

            const messages = this._p2pLinkedState.dispatchAction(ACTION_GET_CACHED_DATA_PACKETS, (dataPacket) => {
              if (dataPacket.packetType !== 'chatMessage') {
                return false;
              }
              
              const {
                fromSocketPeerID: testFromSocketPeerID,
                toSocketPeerID: testToSocketPeerID
              } = dataPacket;

              return testFromSocketPeerID === remoteSocketPeerID || testToSocketPeerID === remoteSocketPeerID;
            }).map(dataPacket => {
              return {
                isFromLocal: (dataPacket.fromSocketPeerID === localSocketID), // naive implementation
                body: dataPacket.data.messageBody
              };
            });

            console.debug({
              messages,
              localSocketID
            });

            const ret = {
              messages
            };

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