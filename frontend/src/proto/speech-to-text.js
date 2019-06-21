const {
    Component,
    ClientProcess,
    ClientWorkerProcess,
    ClientGUIProcess,
    MicrophoneProcess,
    AudioResampler,
    // Float32ArrayWorker,
    components
} = this;
const { Window, IFrame } = components;

const mic = new MicrophoneProcess(process, (mic) => {
    // const audioContext = mic.getAudioContext();
});
const audioResampler = new AudioResampler(process, null, {
    outputDataType: 'Float32Array',
    outputTargetSampleRate: 44000
});

// Process the mic stream
// TODO: Fix so that worker operates under context of Float32ArrayWorker
const float32Worker = new ClientWorkerProcess(process, (worker) => {
    worker.getAverage = (float32Array) => {
        // Turn Float32Array into regular array

        // sum all the elements of the array
        const sum = float32Array.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
        });

        const average = sum / float32Array.length;

        return average;
    }

    /**
     * Uses this.getFrameAverage() to obtain an average percent, as a float.
     * 
     * @param {*} frame 
     * @return {number} Any value between 0 and 1
     */
    worker.getPercent = (float32Array) => {
        const average = worker.getAverage(float32Array);

        const percent = ((average + 1) / 2);

        return percent;
    }

    worker.getMax = (float32Array) => {
        const max = float32Array.reduce((a, b) => {
            return (a > b ? a : b);
        });

        return max;
    }

    // TODO: Use the server as a wss proxy

    /*
    // TODO: PCM mime type: audio/x-raw
    const ws = new WebSocket('ws://hp4.recotechnologies.com:17201/client/ws/speech?rmeav_sessionid=gpg3IRVXBayGHfogR3uFWdhn532yJ4&rmeav_spkr_engineweight=0.00&rmeav_face_engineweight=0.00&rmeav_spch_engineweight=1.00&rmeav_userid=rmeeng16k16&rmeav_action=segment&rmeav_claimedid=everyone&rmeav_spch_return_adaptation_state=0&rmeav_spkr_segment_return_final_results=1');

    ws.onmessage = (message) => {
        console.debug('ws message', message);
    };
    */
   
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
                    float32Worker.stdout.on('data', this._handleAudioData);
                }

                componentWillUnmount() {
                    this._isMounted = false;

                    // Stop listening to audio data
                    float32Worker.stdout.off('data', this._handleAudioData);
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
    float32Worker.stdin.write(float32Array);
});

// Capture the mic stream
mic.stdout.on('data', (micBuffer) => {
    audioResampler.stdin.write(micBuffer);
});