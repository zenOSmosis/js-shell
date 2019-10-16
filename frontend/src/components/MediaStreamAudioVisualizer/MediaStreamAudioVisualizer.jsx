import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Full from '../Full';
import debounce from 'debounce';

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

    this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
    this._source.disconnect(this._analyser);
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

      this._elCanvas.width = fullSize.width;
      this._elCanvas.height = fullSize.height;
    };
    
    setTimeout(_autoSize, 1000);

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

      const CANVAS_WIDTH = this._elCanvas.width;
      const CANVAS_HEIGHT = this._elCanvas.height;

      // Start drawing the next frame
      /*
      requestAnimationFrame(() => {
        _draw(this._mediaStream.id);
      });
      */
      setTimeout(() => {
        _draw(this._mediaStream.id);
      }, 75);

      // Fill the dataArray with byte frequency data
      this._analyser.getByteFrequencyData(dataArray);

      this._canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      this._canvasCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const barWidth = (CANVAS_WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        this._canvasCtx.fillStyle = 'rgb(' + (barHeight + CANVAS_WIDTH) + ',50,50)';
        this._canvasCtx.fillRect(x, CANVAS_WIDTH - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
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
        ></canvas>
      </Full>
    );
  }
}

export default MediaStreamAudioVisualizer;