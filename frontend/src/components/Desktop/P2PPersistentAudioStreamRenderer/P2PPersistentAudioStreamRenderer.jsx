import React, { Component, Fragment } from 'react';
import MediaStreamRenderer from 'components/MediaStreamRenderer';
import P2PLinkedState, {
  STATE_REMOTE_PEERS,
  STATE_LAST_UPDATED_PEER
} from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';

// TODO: This class should be treated as a singleton
class P2PPersistentAudioStreamRenderer extends Component {
  render() {
    const { [STATE_REMOTE_PEERS]: remotePeers } = this.props;

    return (
      <Fragment>
        {
          remotePeers.map((remotePeer, idx) => {
            const incomingMediaStream = remotePeer.getWebRTCIncomingMediaStream();

            if (!incomingMediaStream) {
              return false;
            }
            
            return (
              <MediaStreamRenderer
                key={idx}
                elementType="audio"
                mediaStream={incomingMediaStream}
                style={{display: 'none'}}
              />
            );
          })
        }
      </Fragment>
    );
  }
}

export default hocConnect(P2PPersistentAudioStreamRenderer, P2PLinkedState, (updatedState) => {
  const {
    [STATE_REMOTE_PEERS]: remotePeers,
    [STATE_LAST_UPDATED_PEER]: lastUpdatedPeer
  } = updatedState;

  const filteredState = {};

  if (remotePeers !== undefined) {
    filteredState[STATE_REMOTE_PEERS] = remotePeers;
  }

  if (lastUpdatedPeer !== undefined) {
    filteredState[STATE_LAST_UPDATED_PEER] = lastUpdatedPeer;
  }

  return filteredState;
});