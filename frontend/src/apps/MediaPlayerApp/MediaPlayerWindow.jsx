import React, { Component } from 'react';
import Full from 'components/Full';
import Cover from 'components/Cover';
import Window from 'components/Desktop/Window';
import ReactPlayer from 'components/ReactPlayer';
import SplitterLayout from 'components/SplitterLayout';
import WebSearchTileList from 'components/WebSearchTileList';
// import { Layout, /* Sider, */ Content, Footer } from 'components/Layout';
import { Input } from 'antd';
import 'shared/socketAPI/socketAPITypedefs';
const { Search } = Input;

export default class MediaPlayerWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaURL: null
    };

    this._elSearchInput = null;
    this._webSearchTileList = null;
  }

  componentDidMount() {
    console.debug(this._webSearchTileList);
  }

  _handleSearchKeypress = (evt) => {
    const { which: keyCode } = evt;

    switch (keyCode) {
      case 13: // Enter
        this._handleSearchQuery()
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
  _handleSearchQuery = async () => {
    try {
      const queryValue = this._elSearchInput.value;

      await this._webSearchTileList.query(queryValue);
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
      // thumbnail,
      // title,
      // content,
      // template,
      // publishedDate
    } = result;

    this.setState({
      mediaURL: url
    });
  };

  render() {
    const { ...propsRest } = this.props;
    const { mediaURL } = this.state;
    // const cmdArguments = this.props.app.getCmdArguments();

    return (
      <Window
        {...propsRest}
        toolbarRight={
          <div>
            <Search
              ref={ c => this._elSearchInput = c }
              placeholder="Search"
              onKeyPress={this._handleSearchKeypress}
              size="small"
            />
          </div>
        }
      >
        <SplitterLayout
          secondaryInitialSize={240}
        >
          <Full>
            <ReactPlayer
              url={mediaURL}
              playing
            />
          </Full>
          
          <Full>
            <WebSearchTileList
              ref={ c => this._webSearchTileList = c }
              onResultSelect={this._handleResultSelect}
            />
          </Full>
        </SplitterLayout>
      </Window>
    );
  }
}