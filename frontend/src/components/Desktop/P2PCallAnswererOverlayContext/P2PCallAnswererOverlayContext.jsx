import React, { Component, Fragment } from 'react';
import CallAnswerer from './CallAnswerer';
import captureUserMediaStream from 'utils/mediaStream/captureUserMediaStream';
import P2PLinkedState, {
  STATE_INCOMING_CALL_REQUESTS
} from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';

// Important!  This should be implemented as a singleton
class P2PCallAnswererOverlayContext extends Component {
  async answer(mediaConstraints) {
    try {
      const mediaStream = await captureUserMediaStream(mediaConstraints);

      // TODO: Remove
      console.debug({
        mediaStream
      });
    } catch (exc) {
      throw exc;
    }
  }

  reject() {
    // TODO: Finish implementing
    console.error('reject');
  }

  render() {
    const {
      children,
      [STATE_INCOMING_CALL_REQUESTS]: incomingCallRequests
    } = this.props;

    return (
      <Fragment>
        {
          children
        }

        {
          // TODO: Play chime when new call comes in
          incomingCallRequests.map((incomingCallRequest, idx) => {
            return (
              <CallAnswerer
                key={idx}
                onAnswer={mediaConstraints => this.answer(mediaConstraints)}
                onReject={() => this.reject()}
              />
            );
          })
        }
      </Fragment>
    );
  }
}

export default hocConnect(P2PCallAnswererOverlayContext, P2PLinkedState, (updatedState) => {
  const { [STATE_INCOMING_CALL_REQUESTS]: incomingCallRequests } = updatedState;

  const filteredState = {};

  if (incomingCallRequests !== undefined) {
    filteredState[STATE_INCOMING_CALL_REQUESTS] = incomingCallRequests;
  }

  return filteredState;
});