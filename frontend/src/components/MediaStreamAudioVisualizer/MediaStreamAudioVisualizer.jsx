import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Full from '../Full';
import debounce from 'debounce';

let _sharedAudioCtx = null;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 */
class MediaStreamAudioVisualizer extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this._fullComponent = null;
    this._elFull = null;

    this._elCanvas = null;
    this._canvasCtx = null;

    this._audioCtx = _sharedAudioCtx || new (window.AudioContext || window.webkitAudioContext)();

    if (!_sharedAudioCtx) {
      _sharedAudioCtx = this._audioCtx;
    }

    this._source = null;
    this._analyser = this._audioCtx.createAnalyser();
    this._mediaStream = null;

    this._autosetMediaStream = debounce(this._autosetMediaStream, 50);
  }

  componentDidMount() {
    this._isMounted = true;
    this._elFull = ReactDOM.findDOMNode(this._fullComponent);

    this._canvasCtx = this._elCanvas.getContext('2d');

    this._initAutoCanvasSizer();

    this._autosetMediaStream();
  }

  componentDidUpdate() {
    this._autosetMediaStream();
  }

  componentWillUnmount() {
    if (this._source && this._analyser) {
      this._source.disconnect(this._analyser);
    }

    this._source = null;
    this._audioCtx = null;

    this._isMounted = false;
  }

  _initAutoCanvasSizer() {
    const _autoSize = () => {
      if (!this._isMounted) {
        return;
      }

      const fullSize = this._elFull.getBoundingClientRect();
      const { width: newWidth, height: newHeight } = fullSize;
      const { width: currWidth, height: currHeight } = this._elCanvas;

      if (newWidth !== currWidth || newHeight !== currHeight) {
        this._elCanvas.width = newWidth;
        this._elCanvas.height = newHeight;

        console.debug({
          width: this._elCanvas.width,
          height: this._elCanvas.height
        })
      }

      setTimeout(_autoSize, 1000);
    };

    _autoSize();
  }

  _autosetMediaStream() {
    const { mediaStream: propsMediaStream } = this.props;

    if (this._source && this._analyser) {
      this._source.disconnect(this._analyser);
    }

    if (this._mediaStream && propsMediaStream && this._mediaStream.id === propsMediaStream.id) {
      return;
    } else {
      if (!propsMediaStream || !this._audioCtx) {
        return;
      }

      this._mediaStream = propsMediaStream;
    }

    this._source = this._audioCtx.createMediaStreamSource(this._mediaStream);
    this._source.connect(this._analyser);

    this._analyser.fftSize = 256;
    const bufferLength = this._analyser.frequencyBinCount;
    /*
    console.log({
      bufferLength
    });
    */
    const dataArray = new Uint8Array(bufferLength);

    // this._canvasCtx.clearRect(0, 0, elCanvas.width, elCanvas.height); // TODO: Make width / height dynamic

    const _draw = (mediaStreamId) => {
      if (!this._isMounted || mediaStreamId !== this._mediaStream.id) {
        return;
      }

      if (!this._elCanvas) {
        return;
      }

      const CANVAS_WIDTH = this._elCanvas.width;
      const CANVAS_HEIGHT = this._elCanvas.height;

      // Fill the dataArray with byte frequency data
      this._analyser.getByteFrequencyData(dataArray);

      this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      this._canvasCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const barWidth = (CANVAS_WIDTH / bufferLength);
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] === 0 ? 0 : CANVAS_HEIGHT / (255 / dataArray[i]) * 1.5;

        this._canvasCtx.fillStyle = `rgb(${barHeight + CANVAS_WIDTH}, 50, 50)`;
        this._canvasCtx.fillRect(x, CANVAS_HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }

      // Start drawing the next frame, using setTimeout to throttle
      setTimeout(() => {
        requestAnimationFrame(() => {
          _draw(this._mediaStream.id);
        });
      }, 75);
    };

    // Start rendering
    _draw(this._mediaStream.id);
  }

  render() {
    return (
      <Full ref={c => this._fullComponent = c}>
        {
          // TODO: Make canvas the size of the container
        }
        <canvas
          ref={c => this._elCanvas = c}
          width={150}
          height={150}
        ></canvas>
      </Full>
    );
  }
}

export default MediaStreamAudioVisualizer;