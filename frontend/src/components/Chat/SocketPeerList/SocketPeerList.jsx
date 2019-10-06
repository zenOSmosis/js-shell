import React, { Component } from 'react';
import Row, { Column } from 'components/RowColumn';
import { Avatar } from 'antd';
import classNames from 'classnames';
import styles from './SocketPeerList.module.scss';

class SocketPeerList extends Component {
  selectPeer(peer) {
    const { onPeerSelect } = this.props;

    if (typeof onPeerSelect === 'function') {
      onPeerSelect(peer);
    }
  }

  render() {
    const {
      className,
      connectedPeers,
      selectedPeer,
      style
    } = this.props;

    return (
      <ul
        className={classNames(styles['socket-peer-list'], className)}
        style={style}
      >
        {
          connectedPeers.map((peer) => {
            const peerId = peer.getPeerId();
            const nickname = peer.getNickname();
            const aboutDescription = peer.getAboutDescription();
            const browserOnOs = peer.getBrowserOnOs();

            return (
              <li
                key={peerId}
                title={aboutDescription}
                className={(Object.is(peer, selectedPeer) ? styles['active'] : null)}
              >
                <div
                  onMouseDown={evt => this.selectPeer(peer)}
                  onTouchStart={evt => this.selectPeer(peer)}
                >
                  <Row>
                    <Column style={{ textAlign: 'center', minWidth: 42, maxWidth: 42 }}>
                      <Avatar
                        size={36}
                        icon="user"
                      />
                    </Column>

                    <Column>
                      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        <div style={{ display: 'inline', fontWeight: 'bold' }}>
                          {
                            nickname || '[Untitled Peer]'
                          }
                        </div>

                        <div style={{ display: 'inline', fontSize: '.8rem', fontStyle: 'italic', marginLeft: 4 }}>
                          {
                            `/ ${browserOnOs}`
                          }
                        </div>
                      </div>
                      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        [ Last chat message ]
                      </div>
                    </Column>

                    <Column style={{ maxWidth: 40 }}>
                      abc
                    </Column>
                  </Row>
                </div>
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default SocketPeerList;