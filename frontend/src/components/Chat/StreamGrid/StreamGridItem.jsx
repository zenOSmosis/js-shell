import React, { Component } from 'react';
import { GridItem } from 'components/Grid';
import Layout, { Header, Content } from 'components/Layout';
import Center from 'components/Center';
import MediaStreamRenderer from 'components/MediaStreamRenderer';
import TrackStatusIndicator from './TrackStatusIndicator';
import NormalizedNickname from '../NormalizedNickname';
import DesktopLinkedState from 'state/DesktopLinkedState';
import styles from './StreamGrid.module.scss';

const _desktopLinkedState = new DesktopLinkedState();

class StreamGridItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaStream: null
    };
  }

  componentDidMount() {
    this.autosetMediaStreamTrack();
  }

  componentDidUpdate() {
    this.autosetMediaStreamTrack();
  }

  autosetMediaStreamTrack() {
    const { mediaStream } = this.state;

    if (mediaStream) {
      return;
    }

    const { mediaStreamTrack } = this.props;

    if (mediaStreamTrack) {
      const mediaStream = new MediaStream([mediaStreamTrack]);

      this.setState({
        mediaStream
      });
    }
  }

  render() {
    const {
      children,
      mediaStreamTrack,
      peer,
      ...propsRest
    } = this.props;

    // TODO: Use state for mediaStreamTrack
    const localMediaStream = mediaStreamTrack ? new MediaStream([mediaStreamTrack]) : null;

    return (
      <GridItem
        {...propsRest}
        className={styles['item']}
      >
        <Layout>
          <Header>
            <TrackStatusIndicator mediaStreamTrack={mediaStreamTrack} />
            <NormalizedNickname nickname={peer.getNickname()} />
            {
              mediaStreamTrack.kind
            }
          </Header>
          <Content className={styles['content']}>
            <div className={styles['content-body-wrapper']}>
              <Center>
                {
                  localMediaStream &&
                  <div
                    style={{width: '100%', height: '100%'}}
                    onClick={() => _desktopLinkedState.setBackgroundMediaStream(localMediaStream)}
                  >
                    <MediaStreamRenderer mediaStream={localMediaStream} />
                  </div>
                }
              </Center>
            </div>
          </Content>
        </Layout>
      </GridItem>
    );
  }
}

export default StreamGridItem;