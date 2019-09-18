import React, { Component } from 'react';
import { Grid, GridItem } from 'components/Grid';
import TransparentButton from 'components/TransparentButton';
import { Avatar } from 'antd';

/**
 * @typedef {Object} P2PUser
 * @property {string} nickname
 * @property {string} imageSrc
 */

class SocketPeerList extends Component {
  _handleSocketPeerClick(socketPeerID, evt) {
    const { onSocketPeerClick } = this.props;

    if (typeof onSocketPeerClick === 'function') {
      onSocketPeerClick(socketPeerID, evt);
    }
  }

  render() {
    const { socketPeerIDs } = this.props;

    return (
      <Grid>
        {
          socketPeerIDs.map((socketPeerID, idx) => {
            return (
              <GridItem
                key={idx}
                // title={user.nickname}
                // 
              >
                <TransparentButton
                  onClick={evt => this._handleSocketPeerClick(socketPeerID, evt)}
                >
                  <div>
                    <Avatar
                      size={36}
                      icon="user"
                    />
                  </div>
                  
                  <div>
                    {socketPeerID}
                  </div>
                </TransparentButton>
              </GridItem>
            );
          })
        }
      </Grid>
    );

    /*
    return (
      <Full>
        {
          socketPeerIDs.length === 0 &&
          <Center>
            <span style={{fontStyle: 'italic'}}>No connected peers...</span>
          </Center>
        }
        {
          // TODO: Replace with <TileList />
          socketPeerIDs.length > 0 &&
          <ul style={{ listStyle: 'none', width: '100%' }}>
            {
              socketPeerIDs.map((peer, idx) => {
                return (
                  <li
                    key={idx}
                    style={{margin: 20}}
                  >
                    <div style={{display: 'inline-block'}}>
                      <Avatar size={48} icon="user" />
                    </div>
                    hello
                    <div>
                      {peer}
                    </div>
                    <div>
                      OS: ... | ... | ...
                    </div>
                    <div>
                      <button>Message</button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        }
      </Full>
    )
    */
  }
}

export default SocketPeerList;