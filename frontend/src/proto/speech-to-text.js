const {
  Component,
  ClientProcess,
  ClientWorkerProcess,
  ClientGUIProcess,
  MicrophoneProcess,
  // ClientAudioResampler,
  Float32AudioWorker,
  components
} = this;
const { Window, IFrame } = components;

const mic = new MicrophoneProcess(process);

// Process the mic stream
// TODO: Fix so that worker operates under context of Float32AudioWorker
const f32Worker = new Float32AudioWorker(process, (worker) => {
  // TODO: Send through WSS proxy
  // name: content-type
  // value:  audio/x-raw, layout=(string)interleaved, rate=(int)16000, format=(string)S16LE, channels=(int)1
  // The above is for 16-bit signed 16kHz pcm audio.
  // @see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
  // TODO: Move proxy address generation into a separate module
  // const WS_ENDPOINT = 'ws://hp4.recotechnologies.com:17201/client/ws/speech?rmeav_sessionid=gpg3IRVXBayGHfogR3uFWdhn532yJ4&rmeav_spkr_engineweight=0.00&rmeav_face_engineweight=0.00&rmeav_spch_engineweight=1.00&rmeav_userid=rmeeng16k16&rmeav_action=segment&rmeav_claimedid=everyone&rmeav_spch_return_adaptation_state=0&rmeav_spkr_segment_return_final_results=1&content-type=audio/x-raw';
  // const webSocket = new WebSocket('wss://xubuntu-dev/ws-proxy?wsProxyAddress=' + encodeURI(WS_ENDPOINT));

  let idxStdin = -1;
  let cycleMaxAmplitude = 0;

  worker.stdin.on('data', (float32Array) => {
    idxStdin++;

    // TODO: Determine if more efficient than running on main thread
    const float32ArrayResampled = worker.downsample(float32Array, 16000);

    const maxAmplitude = worker.getMax(float32ArrayResampled);
    if (maxAmplitude > cycleMaxAmplitude) {
      cycleMaxAmplitude = maxAmplitude;
    }

    // Determine if new cycle
    if (idxStdin % 6 === 1) {
      // Determine max for VUMeter
      worker.stdout.write({
        maxAmplitude: cycleMaxAmplitude
      });

      // Start a new cycle
      cycleMaxAmplitude = 0;
    }

    // TODO: Convert float32ArrayResampled to Uint16Array
    // TODO: Send data to WebSocket proxy
    // webSocket.send(uint16Array);
  });

  /*
  webSocket.onmessage = (message) => {
    console.debug('received webSocket message', message);
  };
  */
});

// Route mic audio through f32Worker
mic.stdout.on('data', (float32Array) => {
  f32Worker.stdin.write(float32Array);
});

// Render VUMeter once mic is ready
mic.once('ready', async () => {
  try {
    // const micOutputSampleRate = await mic.fetchOutputSampleRate();

    // TODO: Configure f32Worker w/ micOutputSampleRate

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
            f32Worker.stdout.on('data', this._handleAudioData);
          }

          componentWillUnmount() {
            this._isMounted = false;

            // Stop listening to audio data
            f32Worker.stdout.off('data', this._handleAudioData);
          }

          _handleAudioData(data) {
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