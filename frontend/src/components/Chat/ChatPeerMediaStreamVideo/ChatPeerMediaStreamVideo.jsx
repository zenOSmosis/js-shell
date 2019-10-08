import React, { Component, Fragment } from 'react';
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
      return;
    }

    const webRTCStreams = remotePeer.getWebRTCMediaStreams();

    return (
      <Fragment>
        {
          webRTCStreams.map((mediaStream, idx) => {
            return (
              <MediaStreamRenderer key={idx} mediaStream={mediaStream} />
            )
          })
        }
      </Fragment>
    );
  }
}

export default ChatPeerMediaStreamVideo;