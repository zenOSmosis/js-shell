import React, { Component } from 'react';
import Full from 'components/Full';
import Center from 'components/Center';
import Window from 'components/Desktop/Window';
import LabeledComponent from 'components/LabeledComponent';
import ConnectedReactPlayer from './subComponents/ConnectedReactPlayer';
import ConnectedDuration from './subComponents/ConnectedDuration';
import ConnectedRangeSlider from './subComponents/ConnectedRangeSlider';
import ConnectedNowPlayingHeaderApplet from './subComponents/ConnectedNowPlayingHeaderApplet';
import SplitterLayout from 'components/SplitterLayout';
import WebSearchTileList from 'components/WebSearchTileList';
import { Layout, /* Sider, */ Content, Footer, Row, Column } from 'components/Layout';
import { ButtonGroup, Button } from 'components/ButtonGroup';
import { Input, Icon, Switch } from 'antd';
import 'shared/socketAPI/socketAPITypedefs';
import './MediaPlayerWindow.css';
import MediaPlayerLinkedState from './MediaPlayerLinkedState';
const { Search } = Input;

/**
 * @extends React.Component
 */
export default class MediaPlayerWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaURL: null
    };

    this._elSearchInput = null;
    this._webSearchTileList = null;

    this._mediaPlayerLinkedState = new MediaPlayerLinkedState(); 
  }

  componentWillUnmount() {
    this._mediaPlayerLinkedState.destroy();
  }

  _handleSearchKeypress = (evt) => {
    const { which: keyCode } = evt;

    switch (keyCode) {
      case 13: // Enter
        const { value: query } = evt.target;

        this._handleSearchQuery(query)
        break;

      // TODO: Handle escape

      default:
        // Do nothing
        break;
    }
  };

  /**
   * @return {Promise<void>}
   */
  _handleSearchQuery = async (query) => {
    try {
      await this._webSearchTileList.query(query);
    } catch (exc) {
      throw exc;
    }
  };

  /**
   * @param {SearxResponseResult} result
   */
  _handleResultSelect = (result) => {
    const {
      url,
      thumbnail,
      title,
      // content,
      // template,
      // publishedDate
    } = result;

    this._mediaPlayerLinkedState.setState({
      mediaURL: url,
      thumbnail,
      title
    });
  };

  render() {
    const { ...propsRest } = this.props;
    // const cmdArguments = this.props.app.getCmdArguments();

    return (
      <Window
        {...propsRest}
        toolbarRight={
          <div>
            <Search
              ref={c => this._elSearchInput = c}
              placeholder="Search"
              onKeyPress={this._handleSearchKeypress}
              size="small"
            />
          </div>
        }
        subToolbar={
          <Row>
            <Column>
              <div style={{textAlign: 'left'}}>
                <LabeledComponent label="Native Controls">
                  <Switch />
                </LabeledComponent>
              </div>
             
            </Column>

            <Column style={{textAlign: 'center'}}>
              <ConnectedNowPlayingHeaderApplet />
            </Column>

            <Column>
              <div style={{textAlign: 'right'}}>
                <LabeledComponent label="Layout">
                  <ButtonGroup>
                    <Button>
                      <Icon type="menu-fold" />
                    </Button>

                    <Button disabled>
                      {
                        /**
                         * Sections
                         */
                      }
                      <Icon type="layout" />
                    </Button>
                  </ButtonGroup>
                </LabeledComponent>
              </div>
            </Column>
          </Row>
        }
      >
        <Layout className="media-player-app">
          <Content>
            <Full>
              <SplitterLayout
                secondaryInitialSize={240}
              >
                <Full>
                  <ConnectedReactPlayer />
                </Full>

                <Full>
                  <WebSearchTileList
                    ref={c => this._webSearchTileList = c}
                    onResultSelect={this._handleResultSelect}
                  />
                </Full>
              </SplitterLayout>
            </Full>
          </Content>

          <Footer>
            <div style={{ width: '100%' }}>
              <Row>
                <Column style={{ maxWidth: 140, overflow: 'no-wrap' }}>
                  <ButtonGroup style={{ margin: '5px 10px' }}>
                    <Button style={{ fontSize: 24, height: 34 }}>
                      { /* Prev */}
                      <Icon type="backward" />
                    </Button>

                    <Button style={{ fontSize: 24, height: 34 }}>
                      { /* Play */}
                      <Icon type="caret-right" />
                    </Button>

                    <Button style={{ fontSize: 24, height: 34 }}>
                      { /* Next */}
                      <Icon type="forward" />
                    </Button>
                  </ButtonGroup>
                </Column>
                <Column style={{ padding: '0px 10px' }}>
                  <Center>
                    <ConnectedRangeSlider />
                  </Center>
                </Column>
                <Column style={{ maxWidth: 100 }}>
                  <Center>
                    <ConnectedDuration />
                  </Center>
                </Column>
              </Row>
            </div>
          </Footer>

        </Layout>

      </Window>
    );
  }
}