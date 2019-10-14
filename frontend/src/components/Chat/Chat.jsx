import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Peer from 'utils/p2p/Peer.class';
import Full from '../Full';
import ChatHeader from './Header';
import ChatPeerMediaStreamVideo from './ChatPeerMediaStreamVideo';
import Cover from '../Cover';
import { Layout, Header, Content, Footer } from '../Layout';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import P2PLinkedState, {
  STATE_CHAT_MESSAGES,
  ACTION_GET_CHAT_MESSAGES
} from 'state/P2PLinkedState';
import LinkedStateRenderer from 'components/LinkedStateRenderer';

class Chat extends Component {
  static propTypes = {
    remotePeer: PropTypes.instanceOf(Peer).isRequired,
    isShowingMessages: PropTypes.bool
  }

  render() {
    const { remotePeer, isShowingMessages = true } = this.props;
    const remotePeerId = remotePeer.getPeerId();

    return (
      <Full style={{ backgroundColor: 'rgba(255,255,255,.2)' }}>
        <ChatPeerMediaStreamVideo remotePeer={remotePeer} />

        <LinkedStateRenderer
          key={remotePeerId}
          linkedState={P2PLinkedState}
          onUpdate={(updatedState, p2pLinkedState) => {
            const { [STATE_CHAT_MESSAGES]: stateChatMessages } = updatedState;

            if (stateChatMessages !== undefined) {
              /**
               * @type {ChatMessage[]}
               */
              const chatMessages = p2pLinkedState.dispatchAction(ACTION_GET_CHAT_MESSAGES, (testChatMessage) => {
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
              <Cover>
                <Full>
                  <Layout>
                    <Header>
                      <ChatHeader
                        remotePeer={remotePeer}
                      />
                    </Header>
                    {
                      isShowingMessages &&
                      <Fragment>
                        <Content>
                          <MessageList chatMessages={chatMessages} />
                        </Content>

                        <Footer>
                          <MessageComposer
                            toPeerId={remotePeerId}
                          />
                        </Footer>
                      </Fragment>
                    }
                  </Layout>
                </Full>
              </Cover>
            );
          }}
        />
      </Full>
    );
  }
}

export default Chat;