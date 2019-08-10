import React, { Component } from 'react';
import Full from '../Full';
import TileList, { Tile } from '../TileList';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { Spin, Icon } from 'antd';
import Center from 'components/Center';
import Cover from 'components/Cover';
import { SOCKET_API_ROUTE_WEB_SEARCH } from 'shared/socketAPI/socketAPIRoutes';
import 'shared/socketAPI/socketAPITypedefs';

const AntIcon = <Icon type="loading" style={{ fontSize: 68 }} spin />;

/**
 * @typedef WebSearchTileListState
 * @property {SearxResponseResult[]} results
 * @property {boolean} isSearching
 */

/**
 * A wrapper for TileList with web search results.
 * 
 * @extend React.Component
 */
class WebSearchTileList extends Component {
  constructor(props) {
    super(props);

    /**
     * @type {WebSearchTileListState}
     */
    this.state = {
      results: [],
      isSearching: false
    };
  }

  async query(value) {
    try {
      try {
        this.setState({
          isSearching: true
        });

        // TODO: Allow this to be cancellable
        const results = await socketAPIQuery(SOCKET_API_ROUTE_WEB_SEARCH, {
          query: value
        });

        // TODO: Don't set if the component has already unmounted
        this.setState({
          results,
          isSearching: false
        });

        console.debug(results);
      } catch (exc) {
        throw exc;
      }
    } catch (exc) {
      throw exc;
    }
  }

  /**
   * @param{SearxResponseResult} result
   */
  _handleResultSelect = (result) => {
    const { onResultSelect } = this.props;
    if (typeof onResultSelect === 'function') {
      onResultSelect(result);
    }
  };

  render() {
    const {
      query,
      ...propsRest
    } = this.props;

    const { /*results,*/ isSearching } = this.state;
    const results = [];

    return (
      <Full>
        <TileList
          {...propsRest}
        >
          {
            results.map((result, idx) => {
              const {
                // url,
                thumbnail,
                title,
                // content,
                // template,
                // publishedDate
              } = result;

              return (
                <Tile
                  key={idx}
                  title={title}
                  onClick={evt => { this._handleResultSelect(result) }}
                >
                  <img src={thumbnail} width="100%" />
                </Tile>
              );
            })
          }
        </TileList>

        {
          isSearching &&
          <Cover>
            <Center>
              <div>
                <div style={{ margin: 20 }}>
                  Searching...
                    </div>

                <div>
                  <Spin size="large" indicator={AntIcon} />
                </div>

                <div style={{ margin: 20 }}>
                  <button>Cancel</button>
                </div>
              </div>
            </Center>
          </Cover>
        }
      </Full>
    );
  }
}

export default WebSearchTileList;