import React, { Component, Fragment } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import /* Chat, */ { SocketPeerList, StreamGrid } from 'components/Chat';
import Full from 'components/Full';
// import LabeledComponent from 'components/LabeledComponent';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import SplitterLayout from 'components/SplitterLayout';
// import Switch from 'components/Switch';
import {
  STATE_REMOTE_PEERS,
  STATE_LAST_UPDATED_PEER,
  STATE_CHAT_MESSAGES
} from 'state/P2PLinkedState';

// import { Avatar, Input } from 'antd';
// const { Search } = Input;

class ChatAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      selectedPeer: null,
      isShowingMessages: true,
      isShowingStreamGrid: false,
    };

    const { p2pLinkedState } = this.props.appRuntime.getState();
    this._p2pLinkedState = p2pLinkedState;
  }

  _handlePeerSelect(selectedPeer) {
    this.setState({
      selectedPeer
    });
  }

  _handleShowMessagesSelect(isShowingMessages) {
    this.setState({
      isShowingMessages
    });
  }

  _handleShowStreamGridSelect(isShowingStreamGrid) {
    this.setState({
      isShowingStreamGrid
    });
  }

  render() {
    const { ...propsRest } = this.props;
    const {
      selectedPeer,
      isShowingMessages,
      isShowingStreamGrid
    } = this.state;

    return (
      <Window
        {...propsRest}
        initialWidth={800}
        initialHeight={500}        
        // TODO: Handle accordingly
        /*
        old_toolbarRight={
          <Fragment>
            <LabeledComponent
              label="Stream Grid"
            >
              <Switch
                checkedChildren="Show"
                unCheckedChildren="Hide"
                checked={isShowingStreamGrid}
                onChange={isChecked => this._handleShowStreamGridSelect(isChecked)}
              />
            </LabeledComponent>

            <LabeledComponent
              label="Messages"
            >
              <Switch
                checkedChildren="Show"
                unCheckedChildren="Hide"
                checked={isShowingMessages}
                onChange={isChecked => this._handleShowMessagesSelect(isChecked)}
              />
            </LabeledComponent>
          </Fragment>
        }
        */
      >
        <LinkedStateRenderer
          // TODO: Document why this verbose key name is needed
          key={`${selectedPeer ? selectedPeer.getPeerId() : null}-${isShowingMessages ? 'with' : 'without'}-messages`}
          
          linkedState={this._p2pLinkedState}
          onUpdate={(updatedState) => {
            const {
              [STATE_REMOTE_PEERS]: remotePeers,
              [STATE_LAST_UPDATED_PEER]: lastUpdatedPeer,
              [STATE_CHAT_MESSAGES]: chatMessages
            } = updatedState;

            const filteredState = {};

            if (remotePeers !== undefined) {
              filteredState[STATE_REMOTE_PEERS] = remotePeers;
            }

            if (lastUpdatedPeer !== undefined) {
              filteredState[STATE_LAST_UPDATED_PEER] = lastUpdatedPeer;
            }

            if (chatMessages !== undefined) {
              filteredState[STATE_CHAT_MESSAGES] = chatMessages;
            }

            return filteredState;
          }}
          render={(renderProps) => {
            const {
              [STATE_REMOTE_PEERS]: remotePeers,
              [STATE_LAST_UPDATED_PEER]: lastUpdatedPeer,
              // [STATE_CHAT_MESSAGES]: chatMessages
            } = renderProps;

            if (!remotePeers.length) {
              return (
                <Center>
                  No connected peers
                </Center>
              );
            }

            return (
              <Full>
                <SplitterLayout
                  primaryIndex={1}
                  secondaryInitialSize={220}
                >
                  <Full>
                    <SocketPeerList
                      remotePeers={remotePeers}
                      selectedPeer={selectedPeer}
                      lastUpdatedPeer={lastUpdatedPeer}
                      onPeerSelect={peer => this._handlePeerSelect(peer)}
                    />
                  </Full>

                  <Full>
                    <StreamGrid remotePeers={remotePeers} />
                    {
                      /*
                      selectedPeer &&
                      <Chat
                        remotePeer={selectedPeer}
                        isShowingMessages={isShowingMessages}
                      />
                      */
                    }
                  </Full>
                </SplitterLayout>
              </Full>
            );
          }}
        />
      </Window>
    );
  }
}

export default ChatAppWindow;