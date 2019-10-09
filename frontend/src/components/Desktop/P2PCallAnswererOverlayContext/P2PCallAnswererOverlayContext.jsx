import React, { Component, Fragment } from 'react';
import CallAnswerer from './CallAnswerer';
import captureUserMediaStream from 'utils/mediaStream/captureUserMediaStream';

// Important!  This should be implemented as a singleton
class P2PCallAnswererOverlayContext extends Component {
  async answer(mediaConstraints) {
    try {
      const mediaStream = await captureUserMediaStream(mediaConstraints);

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
    const { children } = this.props;

    return (
      <Fragment>
        {
          children
        }

        {
          // TODO: Implement w/ P2PLinkedState
          // TODO: Play chime when new call comes in
          1 === 2 &&
          <CallAnswerer
            onAnswer={mediaConstraints => this.answer(mediaConstraints)}
            onReject={() => this.reject()}
          />
        }
      </Fragment>
    );
  }
}

export default P2PCallAnswererOverlayContext;