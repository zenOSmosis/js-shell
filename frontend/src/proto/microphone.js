const { ClientProcess } = this;

/**
 * Binds the native microphone to a ClientProcess.
 * 
 * Note, the microphone will attempt to turn on when this class is instantiated
 * and will throw an exception if it cannot do that.
 */
class MicrophoneProcess extends ClientProcess {
  constructor(parentProcess) {
    super(parentProcess, async (proc) => {
      try {
        // const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (exc) {

      }

      /*
      if (navigator.getUserMedia) {

        navigator.getUserMedia({ audio: true },
          (stream) => {
            proc._handleMicStream(stream);
          },
          (e) => {
            throw new Error('Error capturing audio.');
          }
        );

      } else { throw new Error('getUserMedia not supported in this browser.'); }
      */
    });
  }

  _handleMicStream = (stream) => {
    console.debug('Microphone stream', stream);
  }

  kill() {
    // Turn off microphone
    console.warn('TODO: Implement turning off of microphone');

    super.kill();
  }
}

new MicrophoneProcess(process);