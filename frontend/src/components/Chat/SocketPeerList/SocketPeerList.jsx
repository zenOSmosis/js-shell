import React, { Component } from 'react';
import Row, { Column } from 'components/RowColumn';
import { Avatar, Tooltip } from 'antd';
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
            const systemInfo = peer.getSystemInfo();
            const {
              browser: { name: browserName, version: browserVersion },
              engine: { name: engineName, version: engineVersion },
              os: { name: osName, version: osVersion },
              platform: {type: platformType}
            } = systemInfo;

            return (
              <li
                key={peerId}
                title={aboutDescription}
                className={(Object.is(peer, selectedPeer) ? styles['active'] : null)}
              >
                <Tooltip
                  placement="left"
                  title={
                    <div className={styles['tooltip']}>
                      <h1>
                        {nickname}
                      </h1>
                      [ Call Placeholder ]

                      <h2>System Info</h2>
                      <table style={{width: '100%'}}>
                        <thead>
                          <tr>
                            <td>Kind</td>
                            <td>Name</td>
                            <td>Version</td>
                          </tr>
                          <tr>
                            <td>Browser</td>
                            <td>{browserName}</td>
                            <td>{browserVersion}</td>
                          </tr>
                          <tr>
                            <td>Engine</td>
                            <td>{engineName}</td>
                            <td>{engineVersion}</td>
                          </tr>
                          <tr>
                            <td>OS</td>
                            <td>{osName}</td>
                            <td>{osVersion}</td>
                          </tr>
                        </thead>
                      </table>
                      Platform Type: {platformType}
                    </div>
                  }
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

                      <Column isForcedMinWidth={true}>
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
                </Tooltip>
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default SocketPeerList;