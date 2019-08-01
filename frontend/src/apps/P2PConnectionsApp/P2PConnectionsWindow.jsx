import React, { Component } from 'react';
import Button from 'components/Button';
import Window from 'components/Desktop/Window';
import Chat, { UserList } from 'components/Chat';
import { Content, Footer, Row, Column, Section } from 'components/Layout';
import Switch from 'components/Switch';
import LabeledComponent from 'components/LabeledComponent';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
import { Avatar, Input } from 'antd';
const { Search } = Input;

class P2PConnectionsWindow extends Component {

  _handleUserClick = (user) => {
    const { app } = this.props;

    app.handleUserClick(user);
  };

  render() {
    const { ...propsRest } = this.props;

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

        <Full>
          <SplitterLayout secondaryInitialSize={320}>
            <Full>
              <UserList
                onUserClick={ user => { this._handleUserClick(user) } }
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
              <Chat />
            </Full>
          </SplitterLayout>
        </Full>

      </Window>
    );
  }
}

export default P2PConnectionsWindow;