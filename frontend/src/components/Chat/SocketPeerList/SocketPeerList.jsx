import React, { Component } from 'react';
import { Grid, GridItem } from 'components/Grid';
import TransparentButton from 'components/TransparentButton';
import { Avatar } from 'antd';

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
  }
}

export default SocketPeerList;