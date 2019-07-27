// Dev notes:
// Path for VSCode icons:  file:///usr/share/code/resources/app/out/vs/workbench/browser/parts/editor/media

import React, { Component } from 'react';
import Box3D, { BOX3D_SIDES } from 'components/Box3D';
import Cover from 'components/Cover';
// import Full from 'components/Full';
import Center from 'components/Center';
import Window from 'components/Desktop/Window';
import GridBackground from 'components/backgrounds/GridBackground';
import { Layout, Header, Aside, Content, Footer } from 'components/Layout';
import { Select, Option, OptGroup } from 'components/Select';
// import { HorizontalSlider, VerticalSlider } from 'components/Slider';
import { Button, /*ButtonGroup*/ } from 'components/ButtonGroup';
// import SplitterLayout from 'components/SplitterLayout';
import { Switch, /*Icon,*/ Input, Popover } from 'antd';
import { Knob } from 'react-rotary-knob'; // @see https://www.npmjs.com/package/react-rotary-knob
import animate, { ANIMATIONS } from 'utils/animate';
import Editor from './subComponents/Editor';
import SplitEditor from './subComponents/SplitEditor';

const { Search } = Input;

/*
const SLIDER_ACTION_ROTATION = 'Rotation';
const SLIDER_ACTION_POSITION = 'Position';
const SLIDER_ACTION_PERSPECTIVE = 'Perspective';
const SLIDER_ACTION_ZOOM = 'Zoom';
*/

/*
const SLIDER_ACTIONS = [
  SLIDER_ACTION_ROTATION,
  SLIDER_ACTION_POSITION,
  SLIDER_ACTION_PERSPECTIVE,
  SLIDER_ACTION_ZOOM
];
*/

export default class AppBlueprintBaseWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      code: '// type your code...',

      monacoLanguage: 'html',

      // horizontalSliderVal: 0,
      // verticalSliderVal: 0,

      // isLiveRendering: true,

      // renderAxisX: 0,
      // renderAxisY: 0,
      // renderAxisZ: 0,

      // renderPositionX: 0,
      // renderPositionY: 0
    };
  }

  /*
  setEditorLanguage(language) {

  }
  */

  // TODO: Rename
  handleHorizontalSliderChange = (horizontalSliderVal) => {
    this._renderBox.rotate({ degY: horizontalSliderVal });
  }

  // TODO: Rename
  handleVerticalSliderChange = (verticalSliderVal) => {
    this._renderBox.rotate({ degX: verticalSliderVal });
  }

  // TODO: Rename
  handleZTranslationChange = (translateZ) => {
    this._renderBox.rotate({ translateZ });
  }

  // TODO: Rename
  handlePerspectiveChange = (perspective) => {
    this._renderBox.setPerspective(perspective);
  }

  render() {
    const { ...propsRest } = this.props;

    return (
      <Window
        {...propsRest}
      >
        <SplitEditor />

      </Window>
    )
  }

  OLDrender() {
    const { ...propsRest } = this.props;
    // const { code } = this.state;

    const monacoOptions = {
      selectOnLineNumbers: true
    };

    const SearchPopover = (props = {}) => {
      return (
        <div style={{ color: '#000' }}>
          Search type:
          <br />
          - Icons<br />
          - Embed videos<br />
          - Docs (e.g. Mozilla, Antd components, etc.)
          - How to create a search interface
        </div>
      );
    };

    return (
      <Window
        {...propsRest}
        toolbarRight={
          <Popover
            // overlayStyle={{color: '#000'}}
            getPopupContainer={trigger => trigger.parentNode}
            placement="leftTop"
            title={<SearchPopover />}
          >
            <Search
              placeholder="Search"
              style={{ width: '10rem' }}
              size="small"
            />
          </Popover>
        }
        subToolbar={
          <div style={{ overflow: 'visible' }}>
            <div style={{ float: 'left', position: 'relative', height: '100%' }}>
              <div style={{ top: 2, position: 'absolute', whiteSpace: 'nowrap', display: 'inline-block' }}>
                code <Switch /> notes
              </div>
            </div>

            <div style={{ display: 'inline-block', textAlign: 'center', margin: '0px 5px' }}>
              <Button
                size="small"
                icon="caret-right"
                style={{ color: '#000', display: 'inline-block', margin: 0 }}
              >
              </Button>
              <br />
              <label style={{ display: 'inline-block', padding: 0, margin: 0 }}>Run</label>
            </div>

            <div style={{ display: 'inline-block', textAlign: 'center', margin: '0px 5px' }}>
              <Select size="small" style={{ width: 100 }}>
                {
                  BOX3D_SIDES.map((box3DSide, idx) => {
                    return (
                      <Option key={idx} value={box3DSide}>{box3DSide}</Option>
                    );
                  })
                }
              </Select>
              <br />
              <label>Visible Face</label>
            </div>

            <div style={{ display: 'inline-block', textAlign: 'center', margin: '0px 5px' }}>
              <Switch />
              <br />
              <label>Live Rendering</label>
            </div>
          </div>
        }
      >
        <Layout>
          {
            /*
            <Aside width={100}>
              <Button ghost>test button</Button>
            </Aside>
            */
          }
          <Header style={{ height: 20 }}>
            [ header ]
          </Header>
          <Layout>
            <Aside width={500} style={{ height: '100%' }}>
              {
                // TODO: Add resize bindings to Full and trigger monacoEditor w/ changes
              }
              <Editor
                appBlueprintBaseWindow={this} // TODO: Rename to relevant name
                box3D={this._renderBox}
                code={this.state.code}
                monacoOptions={monacoOptions}
              />
            </Aside>
            <Content>
              <Layout>
                <Content>
                  <Layout>
                    <Content>
                      {
                        // Render view
                      }
                      <GridBackground>
                        <Cover>
                          <Layout style={{ height: '100%' }}>
                            <Content style={{ textAlign: 'left', fontSize: '1.2rem' }}>
                              TODO: Place project requirements here
                          </Content>
                            <Footer style={{ textAlign: 'right' }}>
                              <div>
                                <span style={{ fontWeight: 'bold' }}>Scene Base Object:</span> Box3D
                            </div>
                            </Footer>
                          </Layout>
                        </Cover>
                        <Cover>
                          <Center>
                            {
                              // TODO: Pass face / rotation / zoom props to Box3D
                            }
                            <div ref={c => this._renderBoxContainer = c} style={{ width: '100%', height: '100%' }}>
                              <Box3D
                                ref={c => this._renderBox = c}
                              />
                            </div>
                          </Center>
                        </Cover>
                      </GridBackground>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                        <Select onChange={effect => animate(this._renderBoxContainer, effect)} defaultValue="" size="small" style={{ width: '15rem' }}>
                          <Option value="">Choose animation...</Option>
                          <OptGroup label="OptGroup">
                            {
                              ANIMATIONS.map((animation, idx) => {
                                return (
                                  <Option key={idx} value={animation}>{animation}</Option>
                                );
                              })
                            }
                          </OptGroup>
                        </Select>
                        <Button size="small">Animate</Button>
                      </div>
                    </Footer>
                  </Layout>
                </Content>
              </Layout>
            </Content>
            {
              // End of main content
            }
            <Aside width={90} style={{ height: '100%' }}>
              <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
                {
                  // TODO: Add resize bindings to Full and trigger monacoEditor w/ changes
                }
                <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                  <Knob
                    // tipFormatter={null}
                    min={-179}
                    max={179}
                    defaultValue={this.state.verticalSliderVal}
                    onChange={this.handleVerticalSliderChange}
                    style={{ display: 'inline-block' }}
                  /><br />
                  X axis
                    </div>

                <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                  <Knob
                    // tipFormatter={null}
                    min={-179}
                    max={179}
                    defaultValue={this.state.horizontalSliderVal}
                    onChange={this.handleHorizontalSliderChange}
                    style={{ display: 'inline-block' }}
                  /><br />
                  Y axis
                    </div>

                <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                  <Knob
                    // tipFormatter={null}
                    min={0}
                    max={100}
                    defaultValue={100}
                    onChange={this.handleZTranslationChange}
                    style={{ display: 'inline-block' }}
                  /><br />
                  Z axis
                    </div>

                <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                  <Knob
                    // tipFormatter={null}
                    min={0}
                    max={2000}
                    defaultValue={200}
                    onChange={this.handlePerspectiveChange}
                    style={{ display: 'inline-block' }}
                  /><br />
                  Perspective
                    </div>

                <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                  <Knob
                    // tipFormatter={null}
                    min={0}
                    max={2000}
                    defaultValue={200}
                    // onChange={this.handlePerspectiveChange}
                    style={{ display: 'inline-block' }}
                  /><br />
                  Scale X
                    </div>

                <div style={{ display: 'inline-block', margin: '0px 5px', verticalAlign: 'middle' }}>
                  <Knob
                    // tipFormatter={null}
                    min={0}
                    max={2000}
                    defaultValue={200}
                    // onChange={this.handlePerspectiveChange}
                    style={{ display: 'inline-block' }}
                  /><br />
                  Scale Y
                    </div>

              </div>
            </Aside>
          </Layout>
        </Layout>
      </Window>
    );
  }
}