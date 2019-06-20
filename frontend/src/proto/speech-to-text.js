const {
    ClientProcess,
    ClientWorkerProcess,
    MicrophoneProcess,
    AudioResampler
} = this;

const mic = new MicrophoneProcess(process);
const audioResampler = new AudioResampler(process, null, {
    outputDataType: 'Float32Array',
    outputTargetSampleRate: 44000
});

// Capture the mic stream
mic.stdout.on('data', (micBuffer) => {
    audioResampler.stdin.write(micBuffer);
});

// Resample the stream
audioResampler.stdout.on('data', (resampledMicBuffer) => {
    workerProcess.stdin.write(resampledMicBuffer);
});

// Process the mic stream
const workerProcess = new this.ClientWorkerProcess(process, (worker) => {
    worker.stdin.on('data', (buffer) => {
        console.debug(buffer);
    });
});