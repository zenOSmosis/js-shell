import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './MediaStreamVideo.module.scss';

class MediaStreamVideo extends Component {
  constructor(props) {
    super(props);

    this._elVideo = null;
  }

  componentDidMount() {
    this.autosetMediaStream();
  }

  componentDidUpdate() {
    this.autosetMediaStream();
  }

  shouldComponentUpdate() {
    return false;
  }

  autosetMediaStream() {
    const { mediaStream } = this.props;
    const currentMediaStream = this._elVideo.src;

    if (Object.is(mediaStream, currentMediaStream)) {
      return;
    }

    if (this._elVideo.playing) {
      this._elVideo.stop();
    }

    if (!mediaStream) {
      return;
    }

    // if ('srcObject' in this._elVideo) {
      this._elVideo.srcObject = mediaStream;
    // } else {
    //  this._elVideo.src = window.URL.createObjectURL(mediaStream); // for older browsers
    // }

    try {
      this._elVideo.play();
    } catch (exc) {
      console.error(exc);
    }
  }

  // TODO: Include selector to select track

  render() {
    const { className } = this.props;

    return (
      <video
        className={classNames(styles['media-stream-video'], className)}
        ref={c => this._elVideo = c}
        controls={false}
        playsInline={true}
      >
      </video>
    );
  }
}

export default MediaStreamVideo;