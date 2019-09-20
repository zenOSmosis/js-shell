import React, { Component } from 'react';
import Full from '../Full';
import Scrollable from '../Scrollable';
import './TileList.css';

// TODO: Utilize Grid component
class TileList extends Component {
  render() {
    const { children, className, ...propsRest } = this.props; 

    return (
      <Full
        {...propsRest}  
        className={`zd-tile-list ${className ? className : ''}`}
      >
        <Scrollable>
          <div className="zd-tile-list-tiles">
            {
              children
            }
            {
              /*
              tiles.map((tile, idx) => {
                const { title } = tile;

                // TODO: Convert to <Tile />
                return (
                  <div
                    key={idx}
                    // style={{display: 'inline-block', border: '1px #ccc solid', width: '160px', height: '160px', overflow: 'hidden', margin: 5}}
                    className="zd-tile-list-grid-item"
                  >
                    {
                      title
                    }
                  </div>
                )
              })
              */
            }
          </div>
        </Scrollable>
      </Full>
    );
  }
}

export default TileList;