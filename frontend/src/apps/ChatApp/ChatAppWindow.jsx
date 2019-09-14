import React, { Component } from 'react';
// import Button from 'components/Button';
import Window from 'components/Desktop/Window';
import Chat, { SocketPeerList } from 'components/Chat';
// import { Content, Footer, Row, Column, Section } from 'components/Layout';
import Switch from 'components/Switch';
import LabeledComponent from 'components/LabeledComponent';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
// import { Avatar, Input } from 'antd';
// const { Search } = Input;

class ChatAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      selectedSocketPeerID: null
    };
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

        subToolbar={
          <div>TODO: Remove local peer from list</div>
        }
      >

        <Full>
          <SplitterLayout secondaryInitialSize={320}>
            <Full>
              <SocketPeerList
                onSocketPeerClick={ socketPeerID => { this._handleSocketPeerClick(socketPeerID) } }
              />
            </Full>
            {
              /*
              <Full>
                <Row style={{ height: '100%' }}>
                  <Column>
                    <Content>
                      <UserList />
                    </Content>

                    <Footer>
                      <div style={{ display: 'inline-block', margin: '.8rem .8rem' }}>
                        <Avatar size={56}>..</Avatar>
                      </div>

                      <div style={{ display: 'inline-block', margin: '.8rem .8rem' }}>
                        <Avatar size={56} />
                      </div>

                      <div style={{ display: 'inline-block', margin: '.8rem .8rem' }}>
                        <Avatar size={56} />
                      </div>
                    </Footer>
                  </Column>
                </Row>
              </Full>
              */
            }

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

      </Window>
    );
  }
}

export default ChatAppWindow;