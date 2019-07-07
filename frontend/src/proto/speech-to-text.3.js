// Creates a mono-channeled PCM stream from the microphone and streams it to a
// socket.io server
// The stream is playable via: play -r 16000 -b 16 -e signed-integer *.raw

const { MicrophoneProcess, ClientWorkerProcess } = this;

const audioWorker = new ClientWorkerProcess(process, (audioWorker) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');

  // TODO: Make io params dynamic
  // TODO: Pass base address via options
  const sttSocket = io('https://xubuntu-dev', {
    path: '/stt-socket'
  });

  const convertFloat32ToInt16 = (buffer) => {
    let l = buffer.length;
    let buf = new Int16Array(l);

    while (l--) {
        buf[l] = buffer[l] * 0xFFFF; // convert to 16 bit
    }
    return buf.buffer
  };

  audioWorker.bufferUnusedSamples = new Float32Array(0);

  // BT audio speaker / iMac is at 44100; laptop card is at 48000
  const downsampleL16 = (bufferNewSamples, inputSampleRate = 48000, outputSampleRate = 16000) => {
    // TODO: Convert all let to const / let; etc.

    let buffer = null;
    let newSamples = bufferNewSamples.length;
    let unusedSamples = audioWorker.bufferUnusedSamples.length;
    let i;
    let offset;
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
    let filter = [
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

    let samplingRateRatio = inputSampleRate / outputSampleRate;

    let nOutputSamples = Math.floor((buffer.length - filter.length) / samplingRateRatio) + 1;
    let outputBuffer = new Float32Array(nOutputSamples);
    for (i = 0; i + filter.length - 1 < buffer.length; i++) {
      offset = Math.round(samplingRateRatio * i);
      let sample = 0;
      for (let j = 0; j < filter.length; ++j) {
        sample += buffer[offset + j] * filter[j];
      }
      outputBuffer[i] = sample;
    }
    let indexSampleAfterLastUsed = Math.round(samplingRateRatio * i);
    let remaining = buffer.length - indexSampleAfterLastUsed;
    if (remaining > 0) {
      audioWorker.bufferUnusedSamples = new Float32Array(remaining);
      for (i = 0; i < remaining; ++i) {
        audioWorker.bufferUnusedSamples[i] = buffer[indexSampleAfterLastUsed + i];
      }
    } else {
      audioWorker.bufferUnusedSamples = new Float32Array(0);
    }
    return outputBuffer;
  };

  /**
   * Takes float32Array buffer, converts it to S16 and emits it over STT
   * socket. 
   */
  const sttSend = (float32Array) => {
    // TODO: Force LE encoding in pcm16

    // TODO: Pass input & output sample rates to downsampleL16
    const pcm16 = (convertFloat32ToInt16(downsampleL16(float32Array)));
    const audioBlob =  new Blob([pcm16], {
      type: 'audio/pcm'
    });
    sttSocket.emit('audioBlob', audioBlob);
  };

  // Handle the received transcription
  sttSocket.on('transcription', (transcription) => {
    // console.debug('transcription data', transcription);

    const {message} = transcription;

    if (message) {
      const {result} = message;
      
      if (result) {
        const {hypotheses} = result;

        if (hypotheses) {
          const totalHypotheses = hypotheses.length;

          // console.debug('hypotheses', hypotheses);
          hypotheses.forEach((singleHypotheses, idx) => {
            console.debug(`hypotheses ${idx + 1} of ${totalHypotheses}`, singleHypotheses);
          });
        }
      }
    }
  });

  audioWorker.stdin.on('data', (float32Array) => {
    sttSend(float32Array);
  });
});

const mic = new MicrophoneProcess(process,
  async (mic) => {
    try {
      await audioWorker.onceReady();

      // TODO: Send audio worker configuration parameters for mic

      const micOutputAudioFormat = await mic.fetchOutputAudioFormat();
      console.debug('mic output audio format', micOutputAudioFormat);

      const { sampleRate: micOutputSampleRate } = micOutputAudioFormat;

      // TODO: Set options in audioWorker depending on output audio format
      audioWorker.setOptions({
        inputSampleRate: micOutputSampleRate
      });

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