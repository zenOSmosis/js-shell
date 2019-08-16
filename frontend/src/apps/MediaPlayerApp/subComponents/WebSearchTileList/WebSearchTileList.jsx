import React, { Component } from 'react';
import Full from 'components/Full';
import TileList, { Tile } from 'components/TileList';
import Center from 'components/Center';
import Cover from 'components/Cover';
import { Spin, Icon } from 'antd';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
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

  /**
   * Important!  This doesn't resolve a value; it only sets it internally to
   * the class.
   * 
   * @param {string} value
   * @return {Promise<void>} 
   */
  async query(value) {
    try {
      try {
        this.setState({
          isSearching: true
        });

        // TODO: Allow this to be cancellable
        const searxResults = await socketAPIQuery(SOCKET_API_ROUTE_WEB_SEARCH, {
          query: value
        });

        if (searxResults) {
          const { results } = searxResults;

          // TODO: Don't set if the component has already unmounted
          this.setState({
            results,
            isSearching: false
          });
        }
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
      onResultSelect,
      ...propsRest
    } = this.props;

    const { results, isSearching } = this.state;

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
                  header={
                    <div style={{textAlign: 'left'}}>
                      <Icon type="heart" style={{fontSize: 20}} theme="filled" />
                    </div>
                  }
                  title={title}
                  onClick={evt => { this._handleResultSelect(result) }}
                >
                  <img alt={title} src={thumbnail} width="100%" />
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