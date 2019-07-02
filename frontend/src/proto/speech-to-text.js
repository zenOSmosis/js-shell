// This is the original prototype implementation, w/ prototype VU Meter (not currently functional in this implementation)

// @see https://aws.amazon.com/blogs/machine-learning/capturing-voice-input-in-a-browser/
// @see https://github.com/awslabs/aws-lex-browser-audio-capture

// @see http://watson-developer-cloud.github.io/speech-javascript-sdk/master/speech-to-text_webaudio-l16-stream.js.html

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
  outputAudioBufferSize: 256 * 4 * 8,
  // outputDataType: 'AudioBuffer',
  outputDataType: 'Float32Array',
});

/*
const resampler = new ClientAudioResamplerProcess(process,
  (resampler) => {
    resampler.once('ready', async () => {
      try {
        const resamplerOutputFormat = await resampler.fetchOutputAudioFormat();
        console.debug('resampler output format', resamplerOutputFormat);
      } catch (exc) {
        throw exc;
      }
    });
  },
  {
    outputDataType: 'Float32Array'
  }
);
*/

// Process the mic stream / sends over network / etc
// TODO: Fix so that worker operates under context of Float32AudioWorker
const audioWorker = new Float32AudioWorker(process, (audioWorker) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');
  const ttsSocket = io('https://xubuntu-dev', {
    path: '/stt-socket'
  });

  // TODO: Make these dynamic
  const inputSampleRate = 48000;
  const outputSampleRate = 16000;

  audioWorker.bufferUnusedSamples = new Float32Array(0);

  // Note:  This seems to work, but the output sample rate seems off by 2khz.
  const downsampleL16 = (bufferNewSamples) => {
    // TODO: Convert all var to const / let; etc.

    var buffer = null;
    var newSamples = bufferNewSamples.length;
    var unusedSamples = audioWorker.bufferUnusedSamples.length;
    var i;
    var offset;
    if (unusedSamples > 0) {
      buffer = new Float32Array(unusedSamples + newSamples);
      for (i = 0; i < unusedSamples; ++i) {
        buffer[i] = audioWorker.bufferUnusedSamples[i];
      }
      for (i = 0; i < newSamples; ++i) {
        buffer[unusedSamples + i] = bufferNewSamples[i];
      }
    } else {
      buffer = bufferNewSamples;
    }
    // Downsampling and low-pass filter:
    // Input audio is typically 44.1kHz or 48kHz, audioWorker downsamples it to 16kHz.
    // It uses a FIR (finite impulse response) Filter to remove (or, at least attinuate) 
    // audio frequencies > ~8kHz because sampled audio cannot accurately represent  
    // frequiencies greater than half of the sample rate. 
    // (Human voice tops out at < 4kHz, so nothing important is lost for transcription.)
    // See http://dsp.stackexchange.com/a/37475/26392 for a good explination of audioWorker code.
    var filter = [
      -0.037935,
      -0.00089024,
      0.040173,
      0.019989,
      0.0047792,
      -0.058675,
      -0.056487,
      -0.0040653,
      0.14527,
      0.26927,
      0.33913,
      0.26927,
      0.14527,
      -0.0040653,
      -0.056487,
      -0.058675,
      0.0047792,
      0.019989,
      0.040173,
      -0.00089024,
      -0.037935
    ];
    // var samplingRateRatio = audioWorker.options.sourceSampleRate / TARGET_SAMPLE_RATE;
    // TODO: Remove hardcoding; use dynamically
    var samplingRateRatio = inputSampleRate / outputSampleRate;

    var nOutputSamples = Math.floor((buffer.length - filter.length) / samplingRateRatio) + 1;
    var outputBuffer = new Float32Array(nOutputSamples);
    for (i = 0; i + filter.length - 1 < buffer.length; i++) {
      offset = Math.round(samplingRateRatio * i);
      var sample = 0;
      for (var j = 0; j < filter.length; ++j) {
        sample += buffer[offset + j] * filter[j];
      }
      outputBuffer[i] = sample;
    }
    var indexSampleAfterLastUsed = Math.round(samplingRateRatio * i);
    var remaining = buffer.length - indexSampleAfterLastUsed;
    if (remaining > 0) {
      audioWorker.bufferUnusedSamples = new Float32Array(remaining);
      for (i = 0; i < remaining; ++i) {
        audioWorker.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
      }
    } else {
      audioWorker.bufferUnusedSamples = new Float32Array(0);
    }
    return outputBuffer;
  }

  const floatTo16BitPCM = (output, offset, input) => {
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const writeString = (view, offset, string) => {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const encodeWAV = (samples) => {
      // TODO: Remove hardcoded
      const sampleRate = outputSampleRate;

      var buffer = new ArrayBuffer(44 + samples.length * 2);
      var view = new DataView(buffer);
 
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 32 + samples.length * 2, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, samples.length * 2, true);
      floatTo16BitPCM(view, 44, samples);
 
      return view;
    };

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
    const downsampled = downsampleL16(float32Array);
    // const encodedWAV = encodeWAV(downsampleL16(float32Array));
    // console.log(encodedWAV.buffer);
    
    const audioBlob = new Blob([downsampled], {type: 'application/octet-stream'});
    ttsSocket.emit('audioBlob', audioBlob);
    
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
  // audioWorker.stdin.write(float32Array, [float32Array.buffer]);

  // resampler.stdin.write(float32Array);
  audioWorker.stdin.write(float32Array);
});

/*
resampler.stdin.on('data', (resampledFloat32Array) => {
  audioWorker.stdin.write(resampledFloat32Array, [resampledFloat32Array.buffer])
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