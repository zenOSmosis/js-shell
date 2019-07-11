// Creates a mono-channeled PCM stream from the microphone and streams it to a
// socket.io server
// The stream is playable via: play -r 16000 -b 16 -e signed-integer *.raw

const { MicrophoneProcess, ClientAudioWorkerProcess } = this;

const audioWorker = new ClientAudioWorkerProcess(process, (audioWorker) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');

  // TODO: Make io params dynamic
  // TODO: Pass base address via options
  const sttSocket = io('https://xubuntu-dev', {
    path: '/stt-socket'
  });

  /**
   * Takes float32Array buffer, converts it to S16 and emits it over STT
   * socket. 
   */
  const sttSend = (float32Array) => {
    const audioBlob = audioWorker.float32ToPCM16AudioBlob(float32Array);

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
}, {
  // inputSampleRate: 48000 // Should be overridden by passed options
});

const mic = new MicrophoneProcess(process,
  async (mic) => {
    try {
      await audioWorker.onceReady();

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