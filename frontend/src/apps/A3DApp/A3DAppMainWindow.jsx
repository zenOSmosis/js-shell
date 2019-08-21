import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Section from 'components/Section';
import Joystick from 'components/Joystick';
import Scrollable from 'components/Scrollable';
import { SegmentedControl, SegmentedControlItem } from 'components/SegmentedControl';
import LabeledComponent from 'components/LabeledComponent';
import Center from 'components/Center';
import { Knob } from 'react-rotary-knob';

import DesktopWindowLinkedState from 'state/DesktopWindowLinkedState';
import hocConnect from 'state/hocConnect';

class WindowController extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      selectedWindow: null
    };
  }

  selectWindow(desktopWindow) {
    this.setState({
      selectedWindow: desktopWindow
    });
  }

  _handleSelectWindowChange(evt) {
    const { value: idx } = evt.target;

    const desktopWindows = this.props.desktopWindows || [];

    this.selectWindow(desktopWindows[idx]);
  }

  render() {
    const desktopWindows = this.props.desktopWindows || [];
    const { selectedWindow } = this.state;

    console.debug({
      selectedWindow
    });

    return (
      <Scrollable>
        <Section>
          <h1>Window Selector</h1>
          <p>
            Select a window to manipulate.
            </p>

          <select onChange={evt => this._handleSelectWindowChange(evt)}>
            <option value="">Choose...</option>
            {
              desktopWindows.map((desktopWindow, idx) => {
                return (
                  <option value={idx} key={idx}>
                    {
                      desktopWindow.getTitle()
                    }
                  </option>
                )
              })
            }
          </select>
        </Section>

        {
          selectedWindow &&
          <div>
            <Section>
              <h1>Dials</h1>
              <Center>
                <div style={{ margin: 10, display: 'inline-block' }}>
                  <LabeledComponent label="X Rotation">
                    <Knob
                      onChange={percent => { selectedWindow.setRotation({ degX: percent * 3.6 }) }}
                    />
                  </LabeledComponent>
                </div>

                <div style={{ margin: 10, display: 'inline-block' }}>
                  <LabeledComponent label="Y Rotation">
                    <Knob
                      onChange={percent => { selectedWindow.setRotation({ degY: percent * 3.6 }) }}
                    />
                  </LabeledComponent>
                </div>

                <div style={{ margin: 10, display: 'inline-block' }}>
                  <LabeledComponent label="Z Translation">
                    <Knob
                      onChange={percent => { selectedWindow.setRotation({ translateZ: percent * 3.6 }) }}
                    />
                  </LabeledComponent>
                </div>

                <div style={{ margin: 10, display: 'inline-block' }}>
                  <LabeledComponent label="Perspective">
                    <Knob
                      onChange={perspective => { selectedWindow.setPerspective(perspective * 10) }}
                    />
                  </LabeledComponent>
                </div>
              </Center>
            </Section>

            <Section>
              <h1>Joystick</h1>
              <Section style={{ marginTop: 0, marginBottom: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <SegmentedControl>
                    <SegmentedControlItem>
                      Rotate
                </SegmentedControlItem>

                    <SegmentedControlItem>
                      Move
                </SegmentedControlItem>

                    <SegmentedControlItem>
                      Zoom
                </SegmentedControlItem>
                  </SegmentedControl>
                </div>
                <div style={{ height: 200 }}>
                  <Joystick />
                </div>
              </Section>
            </Section>
          </div>
        }
      </Scrollable>
    );
  }
}

const ConnectedWindowController = hocConnect(WindowController, DesktopWindowLinkedState, (updatedState) => {
  const { desktopWindows } = updatedState;

  console.debug({
    desktopWindows
  });

  if (desktopWindows !== undefined) {
    return {
      desktopWindows
    };
  }
});

export default class A3DAppMainWindow extends Component {
  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
        title="3D Controller"
      >
        <ConnectedWindowController />
      </Window>
    );
  }
}