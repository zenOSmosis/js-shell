import React, { Component } from 'react';
// import Full from 'components/Full';
import Window from 'components/Desktop/Window';
import Cover from 'components/Cover';
import ReactPlayer from 'components/ReactPlayer';
import WebSearchTileList from 'components/WebSearchTileList';
// import { Layout, /* Sider, */ Content, Footer } from 'components/Layout';

export default class MediaPlayerWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: Remove hardcoded URL
      mediaURL: 'https://www.youtube.com/watch?v=oUFJJNQGwhk'
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

  _handleSearchQuery = async () => {
    try {
      const queryValue = this._elSearchInput.value;

      const results = await this._webSearchTileList.query(queryValue);

      console.log({
        queryResults: results
      });
    } catch (exc) {
      throw exc;
    }
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
            <input
              ref={ c => this._elSearchInput = c }
              placeholder="Search"
              onKeyPress={this._handleSearchKeypress}
            />
          </div>
        }
      >
        <ReactPlayer
          // url={mediaURL}
          // playing
        />

        <Cover>
          <WebSearchTileList
            ref={ c => this._webSearchTileList = c }
          />
        </Cover>
        
      </Window>
    );
  }
}