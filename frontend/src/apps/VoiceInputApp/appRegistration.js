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
    );
  },
  cmd: (appProcess) => {
    // TODO: The current implementation is not efficient when actively
    // transcribing and moving / resizing windows at the same time, as each
    // render update messes with the Window rendering.
    //
    // Potential solutions to this are:
    //    - 1. (ideal) Rework Window component so that state updates don't
    //    mess with this
    //    - 2. (easier) Create an inner Component view which handles the rapid
    //    updates

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

      micAudioLevelRMS: null,
      micAudioLevelDB: null,

      isAudioWorkerOnline: false,

      transcript: null,

      audioWorkerDownsampleRate: null,

      // STT API connection status
      wsBackendStatus: null
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
                          await audioWorker.exit();

                          audioWorker = null;
                        } catch (exc) {
                          throw exc;
                        }
                      });

                      audioWorker.stdout.on('data', (data) => {
                        const { audioLevels, downsampleRate, transcript } = data;

                        if (typeof audioLevels !== 'undefined') {
                          const { rms, db } = audioLevels;
                          appProcess.setState({
                            micAudioLevelRMS: rms,
                            micAudioLevelDB: db
                          });
                        }

                        if (typeof downsampleRate !== 'undefined') {
                          appProcess.setState({
                            audioWorkerDownsampleRate: downsampleRate
                          });
                        }

                        if (typeof transcript !== 'undefined') {
                          appProcess.setState({
                            transcript
                          });
                        }
                      });

                      // TODO: Properly handle stdctrl messages
                      audioWorker.stdctrl.on('data', (data) => {
                        // Derive backend ws status from data
                        // TODO: Refactor this accordingly
                        (() => {
                          // Proper-cased status, for display purposes
                          let wsBackendStatus = null;
                          
                          // console.debug('received stdctrl data', data);
                          const { wsConnecting, wsOpen, wsClose, wsError } = data;

                          if (wsConnecting) {
                            wsBackendStatus = 'Connecting';
                          } else if (wsOpen) {
                            wsBackendStatus = 'Connected';
                          } else if (wsClose) {
                            wsBackendStatus = 'Closed';
                          } else if (wsError) {
                            console.error(wsError);
                            wsBackendStatus = 'Error: ' + JSON.stringify(wsError);
                          }

                          if (wsBackendStatus) {
                            appProcess.setState({
                              wsBackendStatus
                            });
                          }
                        })();
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

              await micProcess.exit();
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