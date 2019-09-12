import React from 'react';

// TODO: Import EVT_STATE_UPDATE
import registerApp from 'utils/desktop/registerApp';

import VoiceInputWindow from './VoiceInputWindow';
import { HOST_ICON_URL_PREFIX } from 'config';
import MicrophoneProcess from 'process/MicrophoneProcess';
import createAudioWorker from './createAudioWorker';

import VoiceInputLinkedState from './VoiceInputLinkedState';

export default registerApp({
  title: 'Voice Input',
  view: (props) => {
    return (
      <VoiceInputWindow {...props} />
    );
  },
  cmd: (appRuntime) => {
    let _voiceInputLinkedState = new VoiceInputLinkedState();
    appRuntime.on('beforeExit', () => {
      _voiceInputLinkedState.destroy();
    });

    // Keeps view synced to runtime state
    // TODO: Use EVT_STATE_UPDATE
    appRuntime.on('stateUpdate', (updatedState) => {
      _voiceInputLinkedState.setState(updatedState);
    });

    let micProcess = null;
    let audioWorker = null;

    // TODO: Use EVT_STATE_UPDATE
    appRuntime.on('stateUpdate', (updatedState) => {
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

              micProcess = new MicrophoneProcess(appRuntime,
                async (mic) => {
                  try {
                    // Mic to app state sync
                    (() => {
                      appRuntime.setState({
                        isMicOn: true
                      });

                      // TODO: Use EVT_BEFORE_EXIT
                      mic.on('beforeExit', () => {
                        appRuntime.setState({
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

                    appRuntime.setState({
                      micSampleDuration: duration ? duration.toFixed(4) : 0,
                      micSampleLength: length,
                      micNumberOfChannels: numberOfChannels,
                      micSampleRate
                    });

                    console.debug('mic output audio format', micOutputAudioFormat);

                    if (!audioWorker) {
                      audioWorker = createAudioWorker(appRuntime);

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
                        const {
                          audioLevels,
                          downsampleRate: audioWorkerDownsampleRate,
                          transcript
                        } = data;

                        const filteredState = {};

                        if (audioLevels !== undefined) {
                          const { rms, db } = audioLevels;
                          
                          filteredState.micAudioLevelRMS = rms;
                          filteredState.micAudioLevelDB  = db;
                        }

                        if (audioWorkerDownsampleRate !== undefined) {
                          filteredState.audioWorkerDownsampleRate = audioWorkerDownsampleRate;
                          appRuntime.setState({
                            audioWorkerDownsampleRate
                          });
                        }

                        if (transcript !== undefined) {
                          filteredState.transcript = transcript;
                        }

                        appRuntime.setState(filteredState);
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

                          let isSTTConnected = false;

                          if (wsConnecting) {
                            wsBackendStatus = 'Connecting';
                          } else if (wsOpen) {
                            wsBackendStatus = 'Connected';
                            isSTTConnected = true;
                          } else if (wsClose) {
                            wsBackendStatus = 'Closed';
                          } else if (wsError) {
                            console.error(wsError);
                            wsBackendStatus = 'Error: ' + JSON.stringify(wsError);
                          }

                          if (wsBackendStatus) {
                            appRuntime.setState({
                              wsBackendStatus,
                              isSTTConnected
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
  iconSrc: `${HOST_ICON_URL_PREFIX}transcribe/transcribe.svg`
});