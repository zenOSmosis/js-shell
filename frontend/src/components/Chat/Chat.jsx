import React, { Component } from 'react';
import Full from '../Full';
import ChatHeader from './Header';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import P2PLinkedState, { STATE_CACHED_CHAT_MESSAGES, ACTION_GET_CACHED_CHAT_MESSAGES } from 'state/P2PLinkedState';
import LinkedStateRenderer from 'components/LinkedStateRenderer';

class Chat extends Component {
  render() {
    const { remotePeer } = this.props;
    const remotePeerId = remotePeer.getPeerId();

    return (
      <LinkedStateRenderer
        key={remotePeerId}
        linkedState={P2PLinkedState}
        onUpdate={(updatedState, p2pLinkedState) => {
          const { [STATE_CACHED_CHAT_MESSAGES]: stateChatMessages } = updatedState;

          if (stateChatMessages !== undefined) {
            /**
             * @type {ChatMessage[]}
             */
            const chatMessages = p2pLinkedState.dispatchAction(ACTION_GET_CACHED_CHAT_MESSAGES, (testChatMessage) => {              
              const testToPeerId = testChatMessage.getToPeerId();
              if (testToPeerId === remotePeerId) {
                return true;
              } else {
                const testFromPeerId = testChatMessage.getFromPeerId();
                if (testFromPeerId === remotePeerId) {
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
                    // TODO: Rename to toPeerId
                    remotePeerId={remotePeerId}
                  />
                </Header>

                <Content>
                  <MessageList chatMessages={chatMessages} />
                </Content>

                <Footer>
                  <MessageComposer
                    toPeerId={remotePeerId}
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