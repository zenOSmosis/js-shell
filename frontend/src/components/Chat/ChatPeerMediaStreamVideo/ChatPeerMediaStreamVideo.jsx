import React, { Component } from 'react';
import MediaStreamRenderer from 'components/MediaStreamRenderer';
import Peer from 'utils/p2p/Peer.class';
import PropTypes from 'prop-types';

class ChatPeerMediaStreamVideo extends Component {
  static propTypes = {
    remotePeer: PropTypes.instanceOf(Peer)
  }

  render() {
    const { remotePeer } = this.props;

    if (!remotePeer) {
      return false;
    }

    const incomingMediaStream = remotePeer.getWebRTCIncomingMediaStream();

    if (!incomingMediaStream) {
      return false;
    }

    return (
      <MediaStreamRenderer mediaStream={incomingMediaStream} />
    );
  }
}

export default ChatPeerMediaStreamVideo;