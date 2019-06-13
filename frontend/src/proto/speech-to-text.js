const { MicrophoneProcess, PCMAudioRecorderProcess } = this;

const mic = new MicrophoneProcess(process);

// MediaRecorder
const recorder = new PCMAudioRecorderProcess(process);
mic.stdout.on('data', (stream) => {
    // console.debug('Mic stream', stream);
    recorder.stdin.write(stream);
});

// WSS worker