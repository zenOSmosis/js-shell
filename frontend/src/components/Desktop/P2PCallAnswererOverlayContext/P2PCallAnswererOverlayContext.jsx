import React, { Component, Fragment } from 'react';
import CallAnswerer from './CallAnswerer';
import captureUserMediaStream from 'utils/mediaStream/captureUserMediaStream';
import P2PLinkedState, {
  STATE_INCOMING_CALL_REQUESTS,
  ACTION_RESPOND_TO_INCOMING_CALL_REQUEST
} from 'state/P2PLinkedState';
import hocConnect from 'state/hocConnect';

// Important!  This should be implemented as a singleton
class P2PCallAnswererOverlayContext extends Component {
  async answer(incomingCallRequest, mediaConstraints) {
    try {
      const { p2pLinkedState } = this.props;

      const mediaStream = await captureUserMediaStream(mediaConstraints);

      p2pLinkedState.dispatchAction(ACTION_RESPOND_TO_INCOMING_CALL_REQUEST, incomingCallRequest, true, mediaStream);
    } catch (exc) {
      throw exc;
    }
  }

  reject(incomingCallRequest) {
    const { p2pLinkedState } = this.props;

    p2pLinkedState.dispatchAction(ACTION_RESPOND_TO_INCOMING_CALL_REQUEST, incomingCallRequest, false);
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
                onAnswer={mediaConstraints => this.answer(incomingCallRequest, mediaConstraints)}
                onReject={() => this.reject(incomingCallRequest)}
              />
            );
          })
        }
      </Fragment>
    );
  }
}

export default hocConnect(P2PCallAnswererOverlayContext, P2PLinkedState, (updatedState, p2pLinkedState) => {
  const { [STATE_INCOMING_CALL_REQUESTS]: incomingCallRequests } = updatedState;

  const filteredState = {
    p2pLinkedState
  };

  if (incomingCallRequests !== undefined) {
    filteredState[STATE_INCOMING_CALL_REQUESTS] = incomingCallRequests;
  }

  return filteredState;
});