import React, {Component} from 'react';
import RenderObject from '../RenderObject';
import FullViewportPanel from '../FullViewportPanel';
import {Grid, GridItem} from '../Grid';
import socket from './../../utils/socket.io';
import systemCommand from '../../utils/systemCommand';

// speaker-test -c 2

export default class FullViewportSystemInformation extends Component {
  state = {
    modes: [],
    selectedMode: null,
    renderData: null,
    audioDevices: [],
    audioHostAPIs: []
  };

  componentDidMount() {
    // TODO: Turn into method
    socket.emit('fetch-sys-info-modes', null, (modes) => {
      this.setState({
        modes
      });
    });

    this.fetchPortAudioDevices();
    this.fetchPortAudioHostAPIs();
  }

  fetchPortAudioDevices() {
    socket.emit('port-audio:fetch-devices', null, (audioDevices) => {
      console.debug('audio devices', audioDevices);
    
      this.setState({
        audioDevices
      });
    });
  }

  fetchPortAudioHostAPIs() {
    socket.emit('port-audio:fetch-host-apis', null, (audioHostAPIs) => {
      console.debug('audio host APIs', audioHostAPIs);

      this.setState({
        audioHostAPIs
      });
    });
  }

  initSpeakerTest(totalChannels = 2) {
    totalChannels = parseInt(totalChannels);

    // @see https://wiki.archlinux.org/index.php/Advanced_Linux_Sound_Architecture
    systemCommand('speaker-test', ['-c', totalChannels]);
  }

  render () {
    return (
      <FullViewportPanel
        {...this.props}
        title="System Information"
        description="View system information"
      >
        <button onClick={ evt => this.fetchPortAudioDevices() }>Fetch PortAudio Devices</button>
        <button onClick={ evt => this.fetchPortAudioHostAPIs() }>Fetch PortAudio Host APIs</button>

        <button onClick={ evt => this.initSpeakerTest() }>Init Speaker Test</button>
        
        <select onChange={ (evt) => this.setState({
          selectedMode: evt.target.value
        }) }>
          {
            this.state.modes.map((mode, idx) => {
              return (
                <option
                  key={idx}
                  value={mode}
                >
                  {mode}
                </option>
              )
            })
          }
        </select>

        <button onClick={ (evt) => socket.emit('fetch-sys-info', {
          mode: this.state.selectedMode
        }, renderData =>
          {
            this.setState({
              renderData
            })
          }
        )}>
          Fetch
        </button>

        <hr />

        <div>
          <Grid>
            {
              this.state.audioDevices.map((audioDevice, idx) => {
                return (
                  <GridItem
                    key={idx}
                    style={{width: 80, height: 80, border: '1px #ccc solid'}}
                  >
                    {
                      audioDevice.name
                    }
                  </GridItem>
                );
              })
            }
          </Grid>
        </div>

        <hr />

        <div>
          <Grid>
              {
                this.state.audioHostAPIs.map((audioHostAPIs, idx) => {
                  return (
                    <GridItem key={idx}>
                      {
                        audioHostAPIs.name
                      }
                    </GridItem>
                  );
                })
              }
            </Grid>
        </div>

        {
          this.state.renderData &&
          <RenderObject data={this.state.renderData} />
        }
      </FullViewportPanel>
    );
  }
}