import LinkedState from 'state/LinkedState';
import createDesktopNotification from 'utils/desktop/createDesktopNotification';

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

      isInfoViewMode: false,

      title: null,
      description: null,
      thumbnail: null,
      duration: null,
      timeRemaining: null,
      playedPercent: null,
      /**
       * First iteration of this functionality, which only handles searX
       * response results in a single list.
       * 
       * @type {SearxResponseResult[]};
       */
      playListItems: []
    });

    console.debug(this);
  }

  /**
   * Adds a playlist item and generates a notification on addition.
   * 
   * @param {SearxResponseResult} item 
   */
  addPlayListItem(item) {
    const { playListItems } = this.getState();

    playListItems.push(item);

    this.setState({
      playListItems
    });

    createDesktopNotification('Added play list item');
  }
}

export default MediaPlayerLinkedState;