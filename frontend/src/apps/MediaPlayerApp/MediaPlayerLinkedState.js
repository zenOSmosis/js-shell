import LinkedState from 'state/LinkedState';

/**
 * @extends LinkedState
 */
class MediaPlayerLinkedState extends LinkedState {
  constructor() {
    super('media-player-app', {
      mediaURL: null,
      title: null,
      thumbnail: null,
      duration: null,
      timeRemaining: null,
      playedPercent: null
    });
  }
}

export default MediaPlayerLinkedState;