import React, { Component } from 'react';
import TileList, { Tile } from '../TileList';
import socketAPIQuery from 'utils/socketAPI/socketAPIQuery';
import { SOCKET_API_ROUTE_WEB_SEARCH } from 'shared/socketAPI/socketAPIRoutes';

/**
 * A wrapper for TileList with web search results.
 * 
 * @extend React.Component
 */
class WebSearchTileList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    };
  }

  async query(value) {
    try {
      try {
        // TODO: Allow this to be cancellable
        const results = await socketAPIQuery(SOCKET_API_ROUTE_WEB_SEARCH, {
          query: value
        });

        // TODO: Don't set if the component has already unmounted
        this.setState({
          results
        });
      } catch (exc) {
        throw exc;
      }
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const {
      query,
      ...propsRest
    } = this.props;

    const { results } = this.state;

    return (
      <TileList
        {...propsRest}
      >
        {
          results.map((result, idx) => {
            // WebSearchQueryResult
            const {
              url,
              thumbnail,
              title,
              content,
              template,
              publishedDate
            } = result;
            
            return (
              <Tile
                key={idx}
                title={title}
              >
                <img src={thumbnail} width="100%" />
              </Tile>
            );
          })
        }
      </TileList>
    );
  }
}

export default WebSearchTileList;