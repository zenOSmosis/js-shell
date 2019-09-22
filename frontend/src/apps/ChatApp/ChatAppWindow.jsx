import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import Chat, { SocketPeerList } from 'components/Chat';
import Full from 'components/Full';
import LabeledComponent from 'components/LabeledComponent';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import SplitterLayout from 'components/SplitterLayout';
import Switch from 'components/Switch';

// import { Avatar, Input } from 'antd';
// const { Search } = Input;

class ChatAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      selectedSocketPeerId: null
    };

    const { p2pLinkedState } = this.props.appRuntime.getState();
    this._p2pLinkedState = p2pLinkedState;
  }

  _handleSocketPeerClick = (socketPeerId) => {
    this.setState({
      selectedSocketPeerId: socketPeerId
    });
  };

  render() {
    const { ...propsRest } = this.props;
    const { selectedSocketPeerId } = this.state;

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
              defaultChecked={true}
            />
          </LabeledComponent>
        }
      >
        <LinkedStateRenderer
          key={selectedSocketPeerId}
          linkedState={this._p2pLinkedState}
          onUpdate={(updatedState) => {
            const { socketPeerIds } = updatedState;

            if (socketPeerIds !== undefined) {
              return {
                socketPeerIds
              };
            }
          }}
          render={(renderProps) => {
            const { socketPeerIds } = renderProps;

            if (!socketPeerIds.length) {
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
                      socketPeerIds={socketPeerIds}
                      onSocketPeerClick={socketPeerId => { this._handleSocketPeerClick(socketPeerId) }}
                    />
                  </Full>

                  <Full>
                    {
                      selectedSocketPeerId &&
                      <Chat
                        remoteSocketPeerId={selectedSocketPeerId}
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