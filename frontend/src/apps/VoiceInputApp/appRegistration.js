import React from 'react';

// TODO: Import EVT_STATE_UPDATE
import registerApp from 'utils/desktop/registerApp';

import VoiceInputWindow from './VoiceInputWindow';
import config from 'config';
import MicrophoneProcess from 'process/MicrophoneProcess';
import createAudioWorker from './createAudioWorker';

export default registerApp({
  title: 'Voice Input',
  mainView: (props) => {
    return (
      <VoiceInputWindow {...props} />
    )
  },
  cmd: (appProcess) => {
    // Keeps view synced to runtime state
    // TODO: Use EVT_STATE_UPDATE
    appProcess.on('stateUpdate', (updatedState) => {
      appProcess.setViewProps(updatedState);
    });

    // Set initial state
    appProcess.setState({
      isMicRequested: false,
      isMicOn: false,

      micSampleDuration: null,
      micSampleLength: null,
      micNumberOfChannels: null,
      micSampleRate: null,

      isAudioWorkerOnline: false,
      connectedSTTBackends: []
    });

    let micProcess = null;
    let audioWorker = null;

    // TODO: Use EVT_STATE_UPDATE
    appProcess.on('stateUpdate', (updatedState) => {
      // Handle mic on / off requests
      (async () => {
        try {
          const { isMicRequested } = updatedState;

          if (typeof isMicRequested !== 'undefined') {
            if (isMicRequested) {
              if (micProcess) {
                console.warn('mic process already active');
                return;
              }

              micProcess = new MicrophoneProcess(appProcess,
                async (mic) => {
                  try {
                    // Mic to app state sync
                    (() => {
                      appProcess.setState({
                        isMicOn: true
                      });

                      // TODO: Use EVT_BEFORE_EXIT
                      mic.on('beforeExit', () => {
                        appProcess.setState({
                          isMicRequested: false,
                          isMicOn: false
                        });
                      });
                    })();

                    const micOutputAudioFormat = await mic.fetchOutputAudioFormat();
                    const {
                      duration,
                      length,
                      numberOfChannels,
                      sampleRate: micSampleRate
                    } = micOutputAudioFormat;
                    
                    appProcess.setState({
                      micSampleDuration: duration,
                      micSampleLength: length,
                      micNumberOfChannels: numberOfChannels,
                      micSampleRate
                    });

                    console.debug('mic output audio format', micOutputAudioFormat);

                    if (!audioWorker) {
                      audioWorker = createAudioWorker(appProcess);

                      // TODO: Use EVT_BEFORE_EXIT
                      mic.on('beforeExit', async () => {
                        try {
                          await audioWorker.kill();

                          audioWorker = null;
                        } catch (exc) {
                          throw exc;
                        }
                      });

                      // TODO: Properly handle stdctrl messages
                      audioWorker.stdctrl.on('data', (data) => {
                        console.debug('received stdctrl data', data);
                      });
                    }

                    await audioWorker.onceReady();

                    // const { sampleRate: micOutputSampleRate } = micOutputAudioFormat;

                    // Set options in audio worker
                    audioWorker.setOptions({
                      inputSampleRate: micSampleRate
                    });

                    // TODO: Use EVT_PIPE_DATA
                    mic.stdout.on('data', (float32Array) => {
                      // Pass the buffer as a transfer object
                      audioWorker.stdin.write(float32Array, [float32Array.buffer]);

                      // console.debug(float32Array);
                    });

                  } catch (exc) {
                    throw exc;
                  }
                },
                {
                  outputAudioBufferSize: 256 * 4 * 8,
                  outputDataType: 'Float32Array'
                }
              );

              await micProcess.onceReady();
            } else {
              if (!micProcess) {
                return;
              }

              await micProcess.kill();
              micProcess = null;
            }
          }
        } catch (exc) {
          throw exc;
        }
      })();
    });
  },
  iconSrc: `${config.HOST_ICON_URI_PREFIX}transcribe/transcribe.svg`
});