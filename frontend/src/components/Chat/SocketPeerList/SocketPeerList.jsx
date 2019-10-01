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
  selectPeer(peer) {
    const { onPeerSelect } = this.props;

    if (typeof onPeerSelect === 'function') {
      onPeerSelect(peer);
    }
  }

  render() {
    const {
      connectedPeers
    } = this.props;

    return (
      <Grid>
        {
          connectedPeers.map((peer) => {
            const peerId = peer.getPeerId();
            const nickname = peer.getNickname();
            const aboutDescription = peer.getAboutDescription();
            const browserOnOs = peer.getBrowserOnOs();

            return (
              <GridItem
                key={peerId}
                title={aboutDescription}
              // title={user.nickname}
              // 
              >
                <TransparentButton
                  onClick={evt => { this.selectPeer(peer); console.debug(peer); }}
                >
                  <div>
                    <Avatar
                      size={36}
                      icon="user"
                    />
                  </div>

                  <div>
                    {
                      nickname || '[Untitled Peer]'
                    }

                    {
                      ` / ${browserOnOs}`
                    }
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