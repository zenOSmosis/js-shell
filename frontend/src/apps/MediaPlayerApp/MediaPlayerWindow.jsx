import React, { Component } from 'react';
import Full from 'components/Full';
import Window from 'components/Desktop/Window';
import LabeledComponent from 'components/LabeledComponent';
import ConnectedReactPlayer from './subComponents/ConnectedReactPlayer';
import NowPlayingHeaderApplet from './subComponents/header/NowPlaying';
import MediaPlayerFooter from './subComponents/footer/Footer';
import SplitterLayout from 'components/SplitterLayout';
import WebSearchTileList from './subComponents/WebSearchTileList';
import { Layout, /* Sider, */ Content, Footer, Row, Column } from 'components/Layout';
import { ButtonGroup, Button } from 'components/ButtonGroup';
import { Input, Icon, Switch } from 'antd';
import 'shared/socketAPI/socketAPITypedefs';
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
              <NowPlayingHeaderApplet />
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
            <MediaPlayerFooter />
          </Footer>

        </Layout>

      </Window>
    );
  }
}