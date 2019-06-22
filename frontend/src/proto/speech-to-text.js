const {
    Component,
    ClientProcess,
    ClientWorkerProcess,
    ClientGUIProcess,
    MicrophoneProcess,
    AudioResampler,
    Float32AudioWorker,
    components
} = this;
const { Window, IFrame } = components;

const mic = new MicrophoneProcess(process, (mic) => {
    // const audioContext = mic.getAudioContext();
});
const audioResampler = new AudioResampler(process, null, {
    outputDataType: 'Float32Audio',
    outputTargetSampleRate: 44000
});

// Process the mic stream
// TODO: Fix so that worker operates under context of Float32AudioWorker
const f32Worker = new Float32AudioWorker(process, (worker) => {   
    worker.stdin.on('data', (float32Array) => {
        worker.stdout.write({
            max: worker.getMax(float32Array)
        });
    });
});

mic.once('ready', () => {
    new ClientGUIProcess(process, (proc) => {
        // TODO: How to set view properties from process?
        proc.setContent(
            class Proto extends Component {
                constructor(...args) {
                    super(...args);

                    this._audioContext = null;
                    this._vuMeter = null;
                    this._isCapturing = false;
                    this._isMounted = false;
                    this._tickIdx = -1;
                    this._maxAmplitude = 0;

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

                    if (typeof data.max !== 'undefined') {
                        if (data.max > this._maxAmplitude) {
                            this._maxAmplitude = data.max;
                        }

                        if (this._tickIdx % 4 === 1) {
                            this._vuMeter.postMessage(this._maxAmplitude);
                            this._maxAmplitude = 0;
                        }
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
});

// Resample the stream
audioResampler.stdout.on('data', (float32Array) => {
    f32Worker.stdin.write(float32Array);
});

// Capture the mic stream
mic.stdout.on('data', (micBuffer) => {
    audioResampler.stdin.write(micBuffer);
});