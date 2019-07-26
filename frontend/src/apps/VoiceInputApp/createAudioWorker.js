import ClientAudioWorkerProcess from 'process/ClientAudioWorkerProcess';

export const EVT_TRANSCRIPTION = 'transcription';

const createAudioWorker = (appProcess) => {
  const audioWorker = new ClientAudioWorkerProcess(appProcess, (audioWorker) => {
    // TODO: Bundle Socket.io directly in Worker
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');

    // TODO: Enable passing of external variables to WorkerProcess
    const EVT_BACKEND_WS_CONNECTING = 'wsConnecting';
    const EVT_BACKEND_WS_OPEN = 'wsOpen';
    const EVT_BACKEND_WS_CLOSE = 'wsClose';
    const EVT_BACKEND_WS_ERROR = 'wsError';
  
    const sttSocket = io(self.location.origin, {
      // TODO: Replace hard-coded Socket.io path
      path: '/stt-socket'
    });
  
    /**
     * Converts [signed] Int16Array into an audio blob w/ audio/pcm mimetype, and
     * emits it over the sttSocket.
     */
    const sttSend = (i16Array) => {
      // const audioBlob = audioWorker.float32ToPCM16AudioBlob(float32Array);
      const audioBlob = new Blob([i16Array], {
        type: 'audio/pcm'
      });
  
      sttSocket.emit('audioBlob', audioBlob);
    };

    sttSocket.on(EVT_BACKEND_WS_CONNECTING, () => {
      console.debug('Backend STT web socket connecting');

      audioWorker.stdctrl.write({
        wsConnecting: true
      });
    });

    sttSocket.on(EVT_BACKEND_WS_OPEN, () => {
      console.debug('Backend STT web socket open');

      audioWorker.stdctrl.write({
        wsOpen: true
      });
    });

    sttSocket.on(EVT_BACKEND_WS_CLOSE, () => {
      console.debug('Backend STT web socket closed');

      audioWorker.stdctrl.write({
        wsClose: true
      });
    });

    sttSocket.on(EVT_BACKEND_WS_ERROR, (err) => {
      console.error('Backend STT web socket error', err);

      // Or should we write to stderr?
      audioWorker.stdctrl.write({
        wsError: err
      });
    });
  
    // Handle the received transcription
    sttSocket.on('transcription', (transcription) => {
      // console.debug('transcription data', transcription);
  
      const { message } = transcription;
  
      if (message) {
        const { result } = message;
  
        if (result) {
          const { hypotheses } = result;
  
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
      const f32Downsampled = audioWorker.downsampleL16(float32Array);
      const i16Array = audioWorker.float32ToInt16(f32Downsampled);
      const rms = audioWorker.getRMS(i16Array);
      const db = audioWorker.getDB(rms);
  
      sttSend(i16Array);
  
      /*
      console.debug({
        db,
        rms
      });
      */
  
      audioWorker.stdctrl.write({
        ctrlName: 'vuLevel',
        ctrlData: db
      });
    });
  });

  return audioWorker;
};

export default createAudioWorker;