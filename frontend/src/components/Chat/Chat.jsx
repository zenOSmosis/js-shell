import React, { Component } from 'react';
import Full from '../Full';
import Scrollable from '../Scrollable';
import ChatHeader from './Header';
import {/* Layout, Content, Footer,*/ Row, Column } from '../Layout';
import TextComposer from './TextComposer';
import MessageList from './MessageList';
import sendSocketPeerData from 'utils/p2p/socket.io/sendSocketPeerData';

class Chat extends Component {
  // TODO: Convert messageBody to socketPeerDataPacket
  async _handleMessageSend(messageBody) {
    try {
      const { remoteSocketPeerID } = this.props;

      await sendSocketPeerData(remoteSocketPeerID, messageBody);
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { remoteSocketPeerID } = this.props;

    return (
      <Full style={{ backgroundColor: 'rgba(255,255,255,.2)' }}>
        <Row style={{ height: '100%' }}>
          <Column>
            <Row>
              <Column>
                <ChatHeader
                  remoteSocketPeerID={remoteSocketPeerID}
                />
              </Column>
            </Row>
            <Row style={{ height: '100%' }}>
              <Column>
                <Scrollable>
                  <MessageList />
                </Scrollable>
              </Column>
            </Row>
            <Row>
              <Column>
                <TextComposer
                  onMessageSend={messageBody => { this._handleMessageSend(messageBody) }}
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