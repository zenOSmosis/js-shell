const {
    ClientProcess,
    ClientWorkerProcess,
    MicrophoneProcess,
    AudioResampler
} = this;

const mic = new MicrophoneProcess(process, (mic) => {
    // const audioContext = mic.getAudioContext();
});
const audioResampler = new AudioResampler(process, null, {
    outputDataType: 'Float32Array',
    outputTargetSampleRate: 16000
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
    // TODO: Use the server as a wss proxy
    
    /*
    const ws = new WebSocket('ws://hp4.recotechnologies.com:17201/client/ws/speech?rmeav_sessionid=gpg3IRVXBayGHfogR3uFWdhn532yJ4&rmeav_spkr_engineweight=0.00&rmeav_face_engineweight=0.00&rmeav_spch_engineweight=1.00&rmeav_userid=rmeeng16k16&rmeav_action=segment&rmeav_claimedid=everyone&rmeav_spch_return_adaptation_state=0&rmeav_spkr_segment_return_final_results=1');

    ws.onmessage = (message) => {
        console.debug('ws message', message);
    };
    */

    worker.stdin.on('data', (buffer) => {
        // ws.send(buffer);

        console.debug(buffer);
    });
});