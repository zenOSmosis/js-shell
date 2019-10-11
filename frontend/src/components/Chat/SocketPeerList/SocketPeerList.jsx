import React, { Component } from 'react';
import Row, { Column } from 'components/RowColumn';
import NormalizedNickname from '../NormalizedNickname';
import AvatarWithOnlineStatusIndicator from '../AvatarWithOnlineStatusIndicator';
import { Tooltip } from 'antd';
import CallControls from '../CallControls';
import SystemIcon from '../SystemIcon';
import classNames from 'classnames';
import styles from './SocketPeerList.module.scss';
import P2PLinkedState, {
  ACTION_GET_LAST_CHAT_MESSAGE_TO_OR_FROM_PEER_ID
} from 'state/P2PLinkedState';

class SocketPeerList extends Component {
  constructor(props) {
    super(props);

    this._p2pLinkedState = new P2PLinkedState();
  }

  componentWillUnmount() {
    this._p2pLinkedState.destroy();
    this._p2pLinkedState = null;
  }

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
          connectedPeers.map((remotePeer) => {
            const peerId = remotePeer.getPeerId();
            const isOnline = remotePeer.getIsOnline();
            const nickname = remotePeer.getNickname();
            const aboutDescription = remotePeer.getAboutDescription();
            const browserOnOs = remotePeer.getBrowserOnOs();
            const systemInfo = remotePeer.getSystemInfo();
            const {
              browser: { name: browserName, version: browserVersion },
              engine: { name: engineName, version: engineVersion },
              os: { name: osName, version: osVersion },
              platform: { type: platformType }
            } = systemInfo;

            const lastChatMessage = this._p2pLinkedState.dispatchAction(ACTION_GET_LAST_CHAT_MESSAGE_TO_OR_FROM_PEER_ID, peerId);
            const lastChatMessageBody = lastChatMessage ? lastChatMessage.getMessageBody() : null;

            return (
              <li
                key={peerId}
                title={aboutDescription}
                className={(Object.is(remotePeer, selectedPeer) ? styles['active'] : null)}
              >
                <Tooltip
                  placement="left"
                  title={
                    <div className={styles['tooltip']}>
                      <div style={{float: 'right'}}>
                        <SystemIcon platformType={platformType} />
                      </div>
                      <h1>
                        <NormalizedNickname nickname={nickname} />&nbsp;
                      </h1>
                      
                      <CallControls remotePeer={remotePeer} />

                      <h2>System Info</h2>
                      <table>
                        <thead>
                          <tr>
                            <td></td>
                            <td>Name</td>
                            <td>Version</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={styles['header']}>Browser:</td>
                            <td>{browserName}</td>
                            <td>{browserVersion}</td>
                          </tr>
                          <tr>
                            <td className={styles['header']}>Engine:</td>
                            <td>{engineName}</td>
                            <td>{engineVersion}</td>
                          </tr>
                          <tr>
                            <td className={styles['header']}>OS:</td>
                            <td>{osName}</td>
                            <td>{osVersion}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                >
                  <div
                    className={styles['peer']}
                    onMouseDown={evt => this.selectPeer(remotePeer)}
                    onTouchStart={evt => this.selectPeer(remotePeer)}
                  >
                    <Row>
                      <Column className={styles['avatar-wrapper']}>
                        <AvatarWithOnlineStatusIndicator
                          isOnline={isOnline}
                        />
                      </Column>

                      <Column 
                        className={styles['description-wrapper']}
                        isForcedMinWidth={true}
                      >
                        <div>
                          <div className={styles['title-wrapper']}>
                            <NormalizedNickname nickname={nickname} />
                          </div>

                          <div className={styles['status-wrapper']}>
                            {
                              `/ ${browserOnOs}`
                            }
                          </div>
                        </div>

                        <div>
                          {
                            lastChatMessageBody
                          }
                        </div>
                      </Column>

                      <Column className={styles['last-seen-wrapper']}>
                        <div>abc</div>

                        <div>
                          <SystemIcon platformType={platformType} />
                        </div>
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