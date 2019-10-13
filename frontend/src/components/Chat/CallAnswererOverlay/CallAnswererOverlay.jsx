import React, { Component } from 'react';
import CallAnswerer from './CallAnswerer';
import captureUserMediaStream from 'utils/mediaStream/captureUserMediaStream';
import {
  ACTION_RESPOND_TO_INCOMING_CALL_REQUEST
} from 'state/P2PLinkedState';

class CallAnswererOverlay extends Component {
  async answer(incomingCallRequest, mediaConstraints) {
    try {
      const { p2pLinkedState, onResponse } = this.props;

      const mediaStream = await captureUserMediaStream(mediaConstraints);

      p2pLinkedState.dispatchAction(ACTION_RESPOND_TO_INCOMING_CALL_REQUEST, incomingCallRequest, true, mediaStream);

      onResponse();
    } catch (exc) {
      throw exc;
    }
  }

  reject(incomingCallRequest) {
    const { p2pLinkedState, onResponse } = this.props;

    p2pLinkedState.dispatchAction(ACTION_RESPOND_TO_INCOMING_CALL_REQUEST, incomingCallRequest, false);

    onResponse();
  }

  render() {
    const {
      incomingCallRequest
    } = this.props;

    return (
      <CallAnswerer
        remotePeer={incomingCallRequest}
        onAnswer={mediaConstraints => this.answer(incomingCallRequest, mediaConstraints)}
        onReject={() => this.reject(incomingCallRequest)}
      />
    );
  }
}

export default CallAnswererOverlay;