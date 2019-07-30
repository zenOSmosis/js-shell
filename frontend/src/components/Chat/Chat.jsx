import React, { Component } from 'react';
import Full from '../Full';
import Scrollable from '../Scrollable';
import ChatHeader from './Header';
import {Layout, Content, Footer, Row, Column } from '../Layout';
import TextComposer from './TextComposer';
import MessageList from './MessageList';
import sendChatMessage from 'utils/p2p/sendChatMessage';

class Chat extends Component {
  async _handleMessageSend(message) {
    try {
      await sendChatMessage(message);
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    return (
      <Full style={{backgroundColor: 'rgba(255,255,255,.2)'}}>
        <Row style={{height: '100%'}}>
          <Column>
            <Row>
              <Column>
                <ChatHeader />
              </Column>
            </Row>
            <Row style={{height: '100%'}}>
              <Column>
                <Scrollable>
                  <MessageList />
                </Scrollable>
              </Column>
            </Row>
            <Row>
              <Column>
                <TextComposer
                  onMessageSend={this._handleMessageSend}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      </Full>
    );
  }
}

export default Chat;