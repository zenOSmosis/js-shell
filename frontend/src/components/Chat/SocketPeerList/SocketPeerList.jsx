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
  _handleSocketPeerClick(socketPeerId, evt) {
    const { onSocketPeerClick } = this.props;

    if (typeof onSocketPeerClick === 'function') {
      onSocketPeerClick(socketPeerId, evt);
    }
  }

  render() {
    const { socketPeerIds } = this.props;

    return (
      <Grid>
        {
          socketPeerIds.map((socketPeerId, idx) => {
            return (
              <GridItem
                key={idx}
                // title={user.nickname}
                // 
              >
                <TransparentButton
                  onClick={evt => this._handleSocketPeerClick(socketPeerId, evt)}
                >
                  <div>
                    <Avatar
                      size={36}
                      icon="user"
                    />
                  </div>
                  
                  <div>
                    {socketPeerId}
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
          socketPeerIds.length === 0 &&
          <Center>
            <span style={{fontStyle: 'italic'}}>No connected peers...</span>
          </Center>
        }
        {
          // TODO: Replace with <TileList />
          socketPeerIds.length > 0 &&
          <ul style={{ listStyle: 'none', width: '100%' }}>
            {
              socketPeerIds.map((peer, idx) => {
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