import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './MediaStreamRenderer.module.scss';
import PropTypes from 'prop-types';

class MediaStreamRenderer extends Component {
  static propTypes = {
    elementType: PropTypes.oneOf(['video', 'audio']),
    mediaStream: PropTypes.instanceOf(MediaStream)
  }

  constructor(props) {
    super(props); 

    this._elMedia = null;
    this._mediaStream = null;
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.autosetMediaStream();
  }

  componentWillUnmount() {
    this._isMounted = false;

    if (this._elMedia.stop !== undefined) {
      this._elMedia.stop();
    }
  }

  shouldComponentUpdate() {
    // this.autosetMediaStream();

    return false;
  }

  autosetMediaStream() {
    if (!this._isMounted) {
      return;
    }

    if (this._mediaStream) {
      return;
    }

    const { mediaStream: newMediaStream } = this.props;

    if (!newMediaStream) {
      return;
    };

    this._mediaStream = newMediaStream;

    /*
    if (this._elMedia.playing) {
      this._elMedia.stop();
    }
    */

    // if ('srcObject' in this._elMedia) {
      this._elMedia.srcObject = newMediaStream;
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
    const {
      className,
      elementType = 'video',
      mediaStream,
      ...propsRest
    } = this.props;

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