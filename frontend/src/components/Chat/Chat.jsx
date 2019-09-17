import React, { Component } from 'react';
import Full from '../Full';
import ChatHeader from './Header';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import P2PLinkedState, { STATE_CACHED_CHAT_MESSAGES, ACTION_GET_CACHED_CHAT_MESSAGES } from 'state/P2PLinkedState';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import ChatMessage from 'utils/p2p/ChatMessage';

class Chat extends Component {
  render() {
    const { remoteSocketPeerID } = this.props;

    return (
      <LinkedStateRenderer
        key={remoteSocketPeerID}
        linkedState={P2PLinkedState}
        onUpdate={(updatedState, p2pLinkedState) => {
          const { [STATE_CACHED_CHAT_MESSAGES]: stateChatMessages } = updatedState;

          if (stateChatMessages !== undefined) {
            /**
             * @type {ChatMessage[]}
             */
            const chatMessages = p2pLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGES, (testChatMessage) => {
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