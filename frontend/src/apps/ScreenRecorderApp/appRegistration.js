// @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import ScreenRecorderWindow from './ScreenRecorderWindow';
import RecordScreenIcon from 'components/componentIcons/RecordScreenIcon';
import stopMediaStream from 'utils/mediaStream/stopMediaStream';
import * as socketFS from 'utils/socketFS';

export default registerApp({
  title: 'Screen Recorder',
  view: (props) => {
    return (
      <ScreenRecorderWindow {...props} />
    );
  },
  cmd: (appProcess) => {
    let videoElem = null;
    let stream = null;

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
      try {
        const { videoElem: stateVideoElem } = appProcess.getState();
        videoElem = stateVideoElem;

        const displayMediaOptions = {
          video: {
            cursor: 'never' // TODO: Remove hardcoding
          },
          audio: false // TODO: Remove hardcoding
        };

        stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

        videoElem.srcObject = stream;
        dumpOptionsInfo();

        videoElem.play();

        // Prototype video recording on remote
        (async () => {
          try {
            // TODO: Remove hard-coded path
            const TEMP_PATH = '/tmp/screen_record.webm';

            await socketFS.rm(TEMP_PATH);

            let fd = await socketFS.open(TEMP_PATH, 'w');

            let totalBytes = 0;
            
            var rec = new MediaRecorder(stream);
            rec.ondataavailable = e => {
              new Response(e.data).arrayBuffer().then(buffer => {
                const newBytes = buffer.byteLength;
  
                socketFS.write(fd, buffer, 0, newBytes, totalBytes);
  
                totalBytes += newBytes;
              });
            }
            // Record in chunks of 1 second
            rec.start(1000);

            appProcess.on('beforeExit', () => {
              rec.stop();

              socketFS.close(fd);

              fd = null;
            });
          } catch (exc) {
            throw exc;
          }
        })();

        appProcess.setState({
          isCapturing: true
        });
      } catch (err) {
        console.error('Error: ' + err);
      }
    };

    const stopCapture = () => {
      if (stream) {
        stopMediaStream(stream);
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
  iconView: () => <RecordScreenIcon />
});