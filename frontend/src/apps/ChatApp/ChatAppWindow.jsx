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
      selectedSocketPeerID: null
    };

    this._p2pLinkedState = this.props.p2pLinkedState;
  }

  _handleSocketPeerClick = (socketPeerID) => {
    this.setState({
      selectedSocketPeerID: socketPeerID
    });
  };

  render() {
    const { ...propsRest } = this.props;

    const { selectedSocketPeerID } = this.state;

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
          key={selectedSocketPeerID}
          linkedState={this._p2pLinkedState}
          onUpdate={(updatedState) => {
            const { socketPeerIDs } = updatedState;

            if (socketPeerIDs !== undefined) {
              return {
                socketPeerIDs
              };
            }
          }}
          render={(renderProps) => {
            const { socketPeerIDs } = renderProps;

            if (!socketPeerIDs.length) {
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
                      socketPeerIDs={socketPeerIDs}
                      onSocketPeerClick={socketPeerID => { this._handleSocketPeerClick(socketPeerID) }}
                    />
                  </Full>

                  <Full>
                    {
                      selectedSocketPeerID &&
                      <Chat
                        remoteSocketPeerID={selectedSocketPeerID}
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