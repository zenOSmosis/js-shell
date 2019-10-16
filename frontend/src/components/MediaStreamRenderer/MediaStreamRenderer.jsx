import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './MediaStreamRenderer.module.scss';
import debounce from 'debounce';
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

    // Debounce is applied to _autosetMediaStream to prevent it from erroring
    // if streams are changed rapidly
    this._autosetMediaStream = debounce(this._autosetMediaStream, 50);
  }

  componentDidMount() {
    this._autosetMediaStream();
  }

  componentWillUnmount() {
    this._mediaStream = null;

    if (this._elMedia.stop !== undefined) {
      this._elMedia.stop();
    }
  }

  shouldComponentUpdate() {
    this._autosetMediaStream();

    return false;
  }

  _autosetMediaStream() {
    const { mediaStream: newMediaStream } = this.props;

    if (!newMediaStream) {
      if (typeof this._elMedia.stop === 'function') {
        this._elMedia.stop();
      }
      
      return;
    };

    const existingId = this._mediaStream ? this._mediaStream.id : null;
    const newId = newMediaStream.id;

    // Skip stream set if it's the current stream
    if (existingId === newId) {
      return;
    }

    this._mediaStream = newMediaStream;

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