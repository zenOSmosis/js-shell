import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import Cover from 'components/Cover';
import { Divider } from 'antd';
import { CURSOR_OPTIONS, DISPLAY_SURFACES } from './constants';

export default class ScreenRecorderWindow extends Component {
  constructor(...args) {
    super(...args);

    this._videoElem = null;
    this._app = null;
  }

  componentDidMount() {
    const { app } = this.props;
    this._app = app;

    this._app.setState({
      videoElem: this.getVideoElem(),
      viewComponent: this
    });
  }

  getVideoElem() {
    if (!this._videoElem) {
      throw new Error('videoElem is not currently available');
    }

    return this._videoElem;
  }

  startCapture() {
    this._app.setState({
      isCapturingRequested: true
    });
  }

  /**
   * 
   * @param {DisplaySurface} displaySurface 
   */
  selectDisplaySurface(displaySurface) {
    this.setState({
      selectedDisplaySurface: displaySurface
    });
  }

  render() {
    const {
      isCapturing,
      ...propsRest
    } = this.props;

    return (
      <Window
        {...propsRest}
      >
        <Cover>
          <video
            style={{ width: '100%', height: 'auto' }}
            ref={c => this._videoElem = c}
          />
        </Cover>

        {
          !isCapturing &&
          <div>
            <Cover>
              <Center>
                <div style={{ display: 'inline-block' }}>
                  <button style={{ backgroundColor: '#00e500', fontWeight: 'bold', color: '#000', padding: 4 }} onClick={evt => this.startCapture()}>
                    Start Video Capture
                  </button>
                </div>

                <Divider type="vertical" style={{ height: 200, margin: '0px 40px' }} />

                <div style={{ display: 'inline-block', textAlign: 'left' }}>
                  <h1>Video Capture Options</h1>
                  <div>
                    Cursor:

                    <select>
                      {
                        CURSOR_OPTIONS.map((cursorOption, idx) => {
                          // TODO: Implement tooltip showing for this option
                          return (
                            <option key={idx}>
                              {cursorOption.title}
                            </option>
                          );
                        })
                      }
                    </select>
                  </div>

                  <div>
                    Display surface:

                    <select>
                      {
                        DISPLAY_SURFACES.map((displaySurface, idx) => {
                          return (
                            <option key={idx}>
                              {displaySurface.title}
                            </option>
                          );
                        })
                      }
                    </select>
                  </div>

                  <div>
                    <input type="checkbox" /> Logical Surface
                  </div>
                </div>
              </Center>
            </Cover>
          </div>
        }

      </Window>
    );
  }
}