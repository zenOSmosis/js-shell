import LinkedState from 'state/LinkedState';

class VoiceInputLinkedState extends LinkedState {
  constructor() {
    super('voice-input-linked-state', {
      isMicRequested: false,
      isMicOn: false,

      micSampleDuration: null,
      micSampleLength: null,
      micNumberOfChannels: null,
      micSampleRate: null,

      micAudioLevelRMS: null,
      micAudioLevelDB: null,

      isAudioWorkerOnline: false,

      transcript: null,

      audioWorkerDownsampleRate: null,
      isSTTConnected: false,

      // STT API connection status
      wsBackendStatus: null
    });
  }
}

export default VoiceInputLinkedState;