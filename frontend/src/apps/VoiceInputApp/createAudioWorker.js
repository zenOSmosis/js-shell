// Allow self keyword
/* eslint no-restricted-globals: 0 */

import ClientAudioWorkerProcess from 'process/ClientAudioWorkerProcess';

// Worker code is evaluated inline, so any functions available in Worker thread
// must be declared externally in order to compile w/o warnings
const importScripts = () => null; // Not evaluated within Worker
const io = () => null; // Not evaulated within Worker

const createAudioWorker = (appRuntime) => {
  const audioWorker = new ClientAudioWorkerProcess(appRuntime, (audioWorker) => {
    // TODO: Bundle Socket.io directly in Worker
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');

    // TODO: Enable passing of external variables to WorkerProcess
    const EVT_BACKEND_WS_CONNECTING = 'wsConnecting';
    const EVT_BACKEND_WS_OPEN = 'wsOpen';
    const EVT_BACKEND_WS_CLOSE = 'wsClose';
    const EVT_BACKEND_WS_ERROR = 'wsError';
    const EVT_TRANSCRIPT = 'transcript';
  
    const sttSocket = io(self.location.origin, {
      // TODO: Replace hard-coded Socket.io path
      path: '/stt-socket/socket.io'
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
  
    // Handle the received transcript
    sttSocket.on(EVT_TRANSCRIPT, (transcript) => {
      console.debug('transcript data', transcript);
  
      const { text } = transcript;

      audioWorker.stdout.write({
        transcript: {
          text
        }
      });
    });

    /**
     * @typedef {Object} AudioLevels
     * @property {number} rms
     * @property {number} db 
     */

    /**
     * Emits audio level data over stdout after timeout, in order to relax
     * CPU time on the main thread.
     * 
     * @param {AudioLevels} audioLevels
     */
    let _bufferAudioLevelEmit = (() => {
      const BUFFER_TIME = 500;

      let _bufferMaxRMS = -Infinity;
      let _bufferMaxDB = -Infinity;

      let bufferInterval = setInterval(() => {
        audioWorker.stdout.write({
          audioLevels: {
            rms: _bufferMaxRMS,
            db: _bufferMaxDB
          }
        });

        _bufferMaxRMS = -Infinity;
        _bufferMaxDB = -Infinity;
      }, BUFFER_TIME);

      audioWorker.on('beforeExit', () => {
        clearInterval(bufferInterval);
      });

      return (audioLevels) => {
        const { rms, db } = audioLevels;

        if (rms > _bufferMaxRMS) {
          _bufferMaxRMS = rms;
        }

        if (db > _bufferMaxDB) {
          _bufferMaxDB = db;
        }
      };
    })();
  
    audioWorker.stdin.on('data', (float32Array) => {
      const f32Downsampled = audioWorker.downsampleL16(float32Array);
      const i16Array = audioWorker.float32ToInt16(f32Downsampled);

      // Send data out for STT processing
      sttSend(i16Array);
  
      // Process audio levels
      const rms = audioWorker.getRMS(i16Array);
      const db = audioWorker.getDB(rms);
     _bufferAudioLevelEmit({
       // Both values are rounded up, as we don't need precision here (they
       // are only for display)
       rms: Math.ceil(rms),
       db: Math.ceil(db)
     });

    });

    // TODO: Remove hardcoding & obtain from ClientAudioWorker class
    audioWorker.stdout.write({
      downsampleRate: 16000
    });
  });

  return audioWorker;
};

export default createAudioWorker;