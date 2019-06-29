const {
  Component,
  ClientProcess,
  ClientWorkerProcess,
  ClientGUIProcess,
  MicrophoneProcess,
  ClientAudioResamplerProcess,
  Float32AudioWorker,
  components
} = this;
const { Window, IFrame } = components;

const mic = new MicrophoneProcess(process, null, {
  // outputDataType: 'AudioBuffer'
  outputDataType: 'Float32Array',

  outputAudioBufferSize: 256 * 4 * 8
});

/*
const resampler = new ClientAudioResamplerProcess(process, (resampler) => {
  resampler.once('ready', async () => {
    try {
      const resamplerOutputFormat = await resampler.fetchOutputAudioFormat();
      console.debug('resampler output format', resamplerOutputFormat);
    } catch (exc) {
      throw exc;
    }
  });
}, {
  outputDataType: 'Float32Array'
});
*/

// Process the mic stream / sends over network / etc
// TODO: Fix so that worker operates under context of Float32AudioWorker
const audioWorker = new Float32AudioWorker(process, (audioWorker) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');
  const ttsSocket = io('https://xubuntu-dev', {
    path: '/stt-socket'
  });

  // TODO: Send through WSS proxy
  // name: content-type
  // value:  audio/x-raw, layout=(string)interleaved, rate=(int)16000, format=(string)S16LE, channels=(int)1
  // The above is for 16-bit signed 16kHz pcm audio.
  // @see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
  // TODO: Move proxy address generation into a separate module
  // const WS_ENDPOINT = 'ws://hp4.recotechnologies.com:17201/client/ws/speech?rmeav_sessionid=gpg3IRVXBayGHfogR3uFWdhn532yJ4&rmeav_spkr_engineweight=0.00&rmeav_face_engineweight=0.00&rmeav_spch_engineweight=1.00&rmeav_userid=rmeeng16k16&rmeav_action=segment&rmeav_claimedid=everyone&rmeav_spch_return_adaptation_state=0&rmeav_spkr_segment_return_final_results=1&content-type=audio/x-raw';
  // const webSocket = new WebSocket('wss://xubuntu-dev/ws-proxy?wsProxyAddress=' + encodeURI(WS_ENDPOINT));

  // let idxStdin = -1;
  // let cycleMaxAmplitude = 0;

  audioWorker.stdin.on('data', (float32Array) => {
    // idxStdin++;

    /*
    const maxAmplitude = audioWorker.getMax(float32Array);
    if (maxAmplitude > cycleMaxAmplitude) {
      cycleMaxAmplitude = maxAmplitude;
    }
    // Determine if new cycle
    if (idxStdin % 6 === 1) {
      // Determine max for VUMeter
      audioWorker.stdout.write({
        maxAmplitude: cycleMaxAmplitude
      });

      // Start a new cycle
      cycleMaxAmplitude = 0;
    }
    */

    // TODO: Send data to WebSocket proxy
    ttsSocket.emit('audioData', float32Array);
  });

  /*
  webSocket.onmessage = (message) => {
    console.debug('received webSocket message', message);
  };
  */
});

// Route mic audio through resampler
mic.stdout.on('data', (float32Array) => {
  // Transfer the array buffer to the worker (via float32Array.buffer)
  // Note: This makes the float32Array unusable on the client
  audioWorker.stdin.write(float32Array, [float32Array.buffer]);

  // resampler.stdin.write(audioBuffer);
});

// Route resampler through audio worker
/*
resampler.stdout.on('data', (resampledFloat32Array) => {
  audioWorker.stdin.write(resampledFloat32Array, [resampledFloat32Array.buffer])
  // console.log(resampledFloat32Array);
});
*/

// Render VUMeter once mic is ready
mic.once('ready', async () => {
  try {
    const micOutputFormat = await mic.fetchOutputAudioFormat();
    console.debug('mic output format', micOutputFormat);

    return;
    
    /*
    const micOutputSampleRate = await mic.fetchOutputSampleRate();
    console.debug('mic output sample rate', micOutputSampleRate);
    */

    // TODO: Configure audioWorker w/ micOutputSampleRate

    new ClientGUIProcess(process, (proc) => {
      // TODO: How to set view properties from process?
      proc.setContent(
        class VUMeter extends Component {
          constructor(...args) {
            super(...args);

            this._audioContext = null;
            this._vuMeter = null;
            this._isCapturing = false;
            this._isMounted = false;

            this._handleAudioData = this._handleAudioData.bind(this);
          }

          componentDidMount() {
            this._isMounted = true;

            // alert('ok');

            console.debug('vu meter', this._vuMeter);

            // Start listening to audio data
            audioWorker.stdout.on('data', this._handleAudioData);
          }

          componentWillUnmount() {
            this._isMounted = false;

            // Stop listening to audio data
            audioWorker.stdout.off('data', this._handleAudioData);
          }

          _handleAudioData(data) {
            if (!this._vuMeter) {
              console.warn('vuMeter is not available');
              return;
            }

            this._tickIdx++;

            const { maxAmplitude } = data;
            if (typeof maxAmplitude !== 'undefined') {
              this._vuMeter.postMessage(maxAmplitude);
            }
          }

          render() {
            console.debug('render props', this.props);

            // TODO: Debug this is not passed through arrow function scope in
            // JIT runtime compiler
            const self = this;
            return (
              <Window title="VU Meter">
                <IFrame
                  ref={c => self._vuMeter = c}
                  src="/components/analog-vu-meter/"
                />
              </Window>
            );
          }
        }
      );
    });
  } catch (exc) {
    throw exc;
  }
});