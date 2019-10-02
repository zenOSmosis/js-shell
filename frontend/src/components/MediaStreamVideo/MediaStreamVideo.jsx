import React, { Component } from 'react';
// import PropTypes from 'prop-types';

class MediaStreamVideo extends Component {
  constructor(props) {
    super(props);

    this._elVideo = null;
  }

  componentDidMount() {
    const { mediaStream } = this.props;

    if ('srcObject' in this._elVideo) {
      this._elVideo.srcObject = mediaStream
    } else {
      this._elVideo.src = window.URL.createObjectURL(mediaStream) // for older browsers
    }

    this._elVideo.play();
  }

  // TODO: Include selector to select track

  render() {
    return (
      <video ref={c => this._elVideo = c} style={{ width: '100%', height: '100%' }}>

      </video>
    );
  }
}

export default MediaStreamVideo;