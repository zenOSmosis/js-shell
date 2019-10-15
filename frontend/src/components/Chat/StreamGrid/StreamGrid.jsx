import React, { Component, Fragment } from 'react';
import Layout, { Header, Content } from 'components/Layout';
import Full from 'components/Full';
import Center from 'components/Center';
import Scrollable from 'components/Scrollable';
import Grid from 'components/Grid';
import StreamGridItem from './StreamGridItem';
import classNames from 'classnames';
import styles from './StreamGrid.module.scss';

class StreamGrid extends Component {
  render() {
    const { remotePeers } = this.props;

    return (
      <Full className={classNames(styles['stream-grid'])}>
        <Layout>
          <Header className={styles['header']}>
            view
            <select>
              <option>all</option>
            </select>
          </Header>
          <Content>
            <Scrollable>
              <Center>
                <Grid>
                  {
                    remotePeers.map(peer => {
                      const peerId = peer.getPeerId();

                      const incomingMediaStream = peer.getWebRTCIncomingMediaStream();
                      if (!incomingMediaStream) {
                        return false;
                      }

                      const tracks = incomingMediaStream.getTracks();

                      return (
                        <Fragment key={peerId}>
                          {
                            tracks.map(track => {
                              return (
                                <StreamGridItem
                                  key={track.id}
                                  mediaStreamTrack={track}
                                  peer={peer}
                                />
                              );
                            })
                          }
                        </Fragment>
                      );
                    })
                  }
                </Grid>
              </Center>
            </Scrollable>
          </Content>
        </Layout>
      </Full>
    );
  }
}

export default StreamGrid;