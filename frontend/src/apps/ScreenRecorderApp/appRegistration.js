// @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import config from 'config';

export default registerApp({
  title: 'Screen Recorder',
  mainView: (props) => {
    return (
      <ScreenRecorderWindow {...props} />
    );
  },
  cmd: (appProcess) => {
    let videoElem = null;

    appProcess.on('stateUpdate', (updatedState) => {
      appProcess.setViewProps(updatedState);
    });

    // Set initial state
    appProcess.setState({
      videoElem: null,
      viewComponent: null,

      isCapturingRequested: false,
      isCapturing: false,

      // @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
      cursor: null,
      displaySurface: null,
      isUsingLogicalSurface: false
    });

    const startCapture = async () => {
      const { videoElem: stateVideoElem } = appProcess.getState();
      videoElem = stateVideoElem;

      const displayMediaOptions = {
        video: {
          cursor: 'never'
        },
        audio: false
      };

      try {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();

        videoElem.play();

        appProcess.setState({
          isCapturing: true
        });
      } catch (err) {
        console.error('Error: ' + err);
      }
    };

    const stopCapture = () => {
      if (videoElem && videoElem.srcObject) {
        let tracks = videoElem.srcObject.getTracks();

        tracks.forEach(track => track.stop());
        videoElem.srcObject = null;
      }
    };

    /**
     * Outputs the current track settings as well as the constraints that were
     * placed upon the stream when it was created.
     */
    const dumpOptionsInfo = () => {
      const videoTrack = videoElem.srcObject.getVideoTracks()[0];

      console.info('Track settings:');
      console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
      console.info('Track constraints:');
      console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    };
    
    appProcess.on('stateUpdate', (updatedState) => {
      console.debug('updated state', updatedState);

      (() => {
        const { isCapturingRequested } = updatedState;

        if (typeof isCapturingRequested !== 'undefined') {
          if (isCapturingRequested) {
            startCapture();
          }
        }
      })();
    });

    // @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

    // Handle process shutdown
    appProcess.on('beforeExit', () => {
      stopCapture();

      // videoElem = null;
    });
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}record/record.svg`
});