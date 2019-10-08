import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './MediaStreamRenderer.module.scss';
import PropTypes from 'prop-types';

class MediaStreamRenderer extends Component {
  static propTypes = {
    elementType: PropTypes.string,
    mediaStream: PropTypes.instanceOf(MediaStream)
  }

  constructor(props) {
    super(props);

    this._elMedia = null;
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
    const currentMediaStream = this._elMedia.src;

    if (Object.is(mediaStream, currentMediaStream)) {
      return;
    }

    if (this._elMedia.playing) {
      this._elMedia.stop();
    }

    if (!mediaStream) {
      return;
    }

    // if ('srcObject' in this._elMedia) {
      this._elMedia.srcObject = mediaStream;
    // } else {
    //  this._elMedia.src = window.URL.createObjectURL(mediaStream); // for older browsers
    // }

    try {
      this._elMedia.play();
    } catch (exc) {
      console.error(exc);
    }
  }

  // TODO: Include selector to select track

  render() {
    const { className, elementType = 'video', ...propsRest } = this.props;

    return React.createElement(
      elementType,
      {
        ...propsRest,
        className: classNames(styles['media-stream-renderer'], className),
        ref: c => this._elMedia = c,
        controls: false,
        playsInline: true
      }
    );
  }
}

export default MediaStreamRenderer;