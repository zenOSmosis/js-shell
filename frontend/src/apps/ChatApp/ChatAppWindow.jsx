import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import Chat, { SocketPeerList } from 'components/Chat';
import Full from 'components/Full';
import LabeledComponent from 'components/LabeledComponent';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import SplitterLayout from 'components/SplitterLayout';
import Switch from 'components/Switch';
import {
  STATE_REMOTE_PEERS,
  STATE_LAST_UPDATED_PEER
} from 'state/P2PLinkedState';

// import { Avatar, Input } from 'antd';
// const { Search } = Input;

class ChatAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      selectedPeer: null,
      isShowingMessages: true
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

  render() {
    const { ...propsRest } = this.props;
    const { selectedPeer, isShowingMessages } = this.state;

    return (
      <Window
        {...propsRest}
        /*
        toolbar={
          // If user isn't in a chat room
          <div style={{ display: 'inline-block' }}>
            <Search
              size="small"
              placeholder="Enter a Chat Room name"
              style={{ minWidth: '220px' }}
            />
            <Button>Join</Button>
          </div>
        }
        */

        toolbarRight={
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
        }
      >
        <LinkedStateRenderer
          key={`${selectedPeer ? selectedPeer.getPeerId() : null}-${isShowingMessages ? 'with' : 'without'}messages`}
          linkedState={this._p2pLinkedState}
          onUpdate={(updatedState) => {
            const {
              [STATE_REMOTE_PEERS]: connectedPeers,
              [STATE_LAST_UPDATED_PEER]: lastUpdatedPeer
            } = updatedState;

            const filteredState = {};

            if (connectedPeers !== undefined) {
              filteredState[STATE_REMOTE_PEERS] = connectedPeers;
            }

            if (lastUpdatedPeer !== undefined) {
              filteredState[STATE_LAST_UPDATED_PEER] = lastUpdatedPeer;
            }

            return filteredState;
          }}
          render={(renderProps) => {
            const {
              [STATE_REMOTE_PEERS]: connectedPeers,
              [STATE_LAST_UPDATED_PEER]: lastUpdatedPeer
            } = renderProps;

            if (!connectedPeers.length) {
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
                      connectedPeers={connectedPeers}
                      selectedPeer={selectedPeer}
                      lastUpdatedPeer={lastUpdatedPeer}
                      onPeerSelect={peer => this._handlePeerSelect(peer)}
                    />
                  </Full>

                  <Full>
                    {
                      selectedPeer &&
                      <Chat
                        remotePeer={selectedPeer}
                        isShowingMessages={isShowingMessages}
                      />
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