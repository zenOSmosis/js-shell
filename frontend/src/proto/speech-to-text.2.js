// This one is functional, though it starts each time the mediaRecorder loops (e.g. start(loopTimeMS))

const{ MicrophoneProcess, MediaStreamRecorder, ClientWorkerProcess } = this;

const worker = new ClientWorkerProcess(process, (worker) => {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');
  // TODO: Make io params dynamic
  const ttsSocket = io('https://xubuntu-dev', {
    path: '/stt-socket'
  });

	worker.stdin.on('data', (audioBlob) => {
    // console.debug('worker received data', data);
    ttsSocket.emit('audioBlob', audioBlob);
  });
});

const mic = new MicrophoneProcess(process, async (mic) => {
  try {
    await worker.onceReady();

    const stream = mic.getOutputStream();

    const mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.audioChannels = 1;
      mediaRecorder.mimeType = 'audio/wav';
      mediaRecorder.ondataavailable = function (blob) {
          worker.stdin.write(blob);
      };
      mediaRecorder.start(3000);

      mic.on('beforeExit', () => {
        mediaRecorder.stop();
      });
  } catch (exc) {
    throw exc;
  }
});