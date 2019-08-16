import LinkedState from 'state/LinkedState';

/**
 * @extends LinkedState
 */
class MediaPlayerLinkedState extends LinkedState {
  constructor() {
    super('media-player-app', {
      mediaURL: null,

      isLoading: false,

      isPlaying: false,
      isPaused: false,
      isEnded: false,

      title: null,
      thumbnail: null,
      duration: null,
      timeRemaining: null,
      playedPercent: null
    });
  }
}

export default MediaPlayerLinkedState;