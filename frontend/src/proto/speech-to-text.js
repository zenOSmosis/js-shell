const {
    ClientProcess,
    ClientWorkerProcess,
    MicrophoneProcess,
    PCMAudioRecorderProcess
} = this;

const mic = new MicrophoneProcess(process);
const worker = new this.ClientWorkerProcess(process, (worker) => {
    worker.stdin.on('data', (buffer) => {
        console.debug(buffer);
    });
});

mic.stdout.on('data', (buffer) => {
    worker.stdin.write(buffer);
});


// worker.stdin.write('hello from client');
/*
const { MicrophoneProcess, PCMAudioRecorderProcess } = this;

const mic = new MicrophoneProcess(process);

// MediaRecorder
const recorder = new PCMAudioRecorderProcess(process);
mic.stdout.on('data', (stream) => {
    // console.debug('Mic stream', stream);
    recorder.stdin.write(stream);
});

// WSS worker
*/