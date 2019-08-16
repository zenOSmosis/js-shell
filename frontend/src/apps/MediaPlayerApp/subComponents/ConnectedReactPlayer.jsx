import React, { Component } from 'react';
import ReactPlayer from 'components/ReactPlayer';
import MediaPlayerLinkedState from '../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';

class WrappedReactPlayer extends Component {
  constructor(props) {
    super(props);

    this._reactPlayer = null;
    this._mediaPlayerLinkedState = null;

    this._duration = null;
  }

  componentDidUpdate(prevProps) {
    if (!this._mediaPlayerLinkedState) {
      const { mediaPlayerLinkedState } = this.props;
      this._mediaPlayerLinkedState = mediaPlayerLinkedState;
    }

    const { mediaURL: prevMediaURL } = prevProps;
    const { mediaURL } = this.props;

    if (prevMediaURL !== mediaURL) {
      this._mediaPlayerLinkedState.setState({
        isLoading: true
      });
    }
  }

  componentWillUnmount() {
    this._mediaPlayerLinkedState.destroy();
    this._mediaPlayerLinkedState = null;
  }

  /**
   * Internally called when the underlying ReactPlayer component has loaded
   * its media.
   */
  _handleReady = (reactPlayer) => {
    console.warn('ready', reactPlayer);

    this._reactPlayer = reactPlayer;

    console.warn('Attempting to aquire duration');
    this._duration = reactPlayer.getDuration();

    this._mediaPlayerLinkedState.setState({
      duration: this._duration,
      isLoading: false
    });
  };
  
  _handleProgress = (evt) => {
    const {
      // loaded,
      // loadedSeconds,
      // played,
      playedSeconds
    } = evt;

    if (this._mediaPlayerLinkedState) {
      const timeRemaining = this.getTimeRemaining(playedSeconds);
      const playedPercent = this.getPlayedPercent(timeRemaining);
  
      this._mediaPlayerLinkedState.setState({
        timeRemaining,
        playedPercent
      });
  
      console.warn({
        timeRemaining,
        playedPercent
      });
    }
  };

  getTimeRemaining(playedSeconds) {
    return this._duration - Math.round(playedSeconds);
  }

  getPlayedPercent(timeRemaining) {
    return Math.round(this._duration / timeRemaining);
  }

  _handleEnded = (evt) => {
    console.warn('Media playing ended', evt);

    if (this._mediaPlayerLinkedState) {
      this._mediaPlayerLinkedState.setState({
        isEnded: true
      });
    }
  };

  render() {
    const { mediaURL } = this.props;

    return (
      <ReactPlayer
        url={mediaURL}
        playing
        onReady={this._handleReady}
        onProgress={this._handleProgress}
        onEnded={this._handleEnded}
      />
    );
  }
}

const ConnectedReactPlayer = hocConnect(WrappedReactPlayer, MediaPlayerLinkedState, (updatedState, mediaPlayerLinkedState) => {
  const { mediaURL } = updatedState;

  const filteredState = {
    mediaPlayerLinkedState
  };

  if (typeof mediaURL === 'string') {
    filteredState.mediaURL = mediaURL;
  }

  return filteredState;
});

export default ConnectedReactPlayer;