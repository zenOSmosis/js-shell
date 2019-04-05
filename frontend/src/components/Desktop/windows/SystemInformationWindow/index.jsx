// TODO: Implement https://blueprintjs.com/docs/#core/components/hotkeys

import React, { Component } from 'react';
// import Center from '../../../Center';
import { Button, ButtonGroup} from '../../../ButtonGroup';
import RenderObject from '../../../RenderObject';
import Window from '../../Window';
import { Grid, GridItem } from '../../../Grid';
import socket from './../../../../utils/socket.io';
import systemCommand from '../../../../utils/systemCommand';
import Icon from '../../../Icon';
import { SegmentedControl, SegmentedControlItem } from '../../../SegmentedControl';

// speaker-test -c 2

// Steps to single window VNC sharing
// You might try using x11vnc to share a single window by doing :
// Run xwininfo from a console. It will change your cursor. Click on the window you want to share. xwininfo will print out the window id.
// Run : x11vnc -id {replace-by-window-id}
// xwininfo
// @see https://superuser.com/questions/393747/how-can-i-share-a-single-application-window-with-tightvnc

export default class SystemInformationWindow extends Component {
  state = {
    modes: [],
    selectedMode: null,
    renderData: null,
    audioDevices: [],
    audioHostAPIs: [],

    selected: 1
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

  render() {
    return (
      <Window
        {...this.props}
        title="System Information"
        description="View system information"
        toolbar={
          <ButtonGroup size="small">
            <Button>
              Overview
            </Button>
            <Button>
              Displays
            </Button>
            <Button>
              Storage
            </Button>
            <Button>
              Memory
            </Button>
            {
              /*
              <Button>
                Processes
              </Button>
              */
            }
          </ButtonGroup>
        }
      >
        <SegmentedControl>
          <SegmentedControlItem>Host</SegmentedControlItem>
          <SegmentedControlItem>Client</SegmentedControlItem>
        </SegmentedControl>
      </Window>
    );
  }

  /*
  renderItems() {
    return [
      this.renderItem(1, 'Overview', <Text><Label>About this Computer</Label></Text>),
      this.renderItem(2, 'CPU', <Text>Content 2</Text>),
      this.renderItem(3, 'Memory', <Text>Content 3</Text>)
      
    ];
  }
  */

  /*
  renderItem(key, title, content) {
    return (
      <SegmentedControlItem
        key={key}
        title={title}
        selected={this.state.selected === key}
        onSelect={() => this.setState({ selected: key })}
      >
        {content}
      </SegmentedControlItem>
    );
  }
  */

  oldRender() {
    return (
      <Window
        {...this.props}
        title="System Information"
        description="View system information"
      >
        <ButtonGroup>
          <Button size="sm">Overview</Button>
          <Button size="sm">CPU</Button>
          <Button size="sm">Memory</Button>
          <Button size="sm">Processes</Button>
          <Button size="sm">Audio</Button>
          <Button size="sm">Network</Button>
        </ButtonGroup>
        
        <div style={{padding: 4}}>
          <Grid>
            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Chassis" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="CPU" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Power" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Memory" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Storage" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Graphics" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Audio" />
            </GridItem>

            <GridItem style={{width: 100, height: 100}}>
              <Icon name="Network" />
            </GridItem>
          </Grid>
        </div>
        <div style={{textAlign: 'left', display: 'none'}}>
          <h1>Host</h1>
          <h2>Motherboard / CPU</h2>
          <h2>Power</h2>
          <h2>Memory</h2>
          <h2>Storage</h2>
          <h2>Graphics</h2>
          <h2>Audio</h2>

          <button onClick={evt => this.fetchPortAudioDevices()}>Fetch PortAudio Devices</button>
          <button onClick={evt => this.fetchPortAudioHostAPIs()}>Fetch PortAudio Host APIs</button>

          <button onClick={evt => this.initSpeakerTest()}>Init Speaker Test</button>

          <button>Fetch Socket.io information</button>

          <select onChange={(evt) => this.setState({
            selectedMode: evt.target.value
          })}>
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

          <button onClick={(evt) => socket.emit('fetch-sys-info', {
            mode: this.state.selectedMode
          }, renderData => {
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
                      style={{ width: 80, height: 80, border: '1px #ccc solid' }}
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
        </div>
      </Window>
    );
  }
}