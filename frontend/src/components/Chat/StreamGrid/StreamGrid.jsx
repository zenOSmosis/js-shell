import React, { Component, Fragment } from 'react';
import Full from 'components/Full';
import Grid, { GridItem } from 'components/Grid';
import MediaStreamVideo from 'components/MediaStreamVideo';

class StreamGrid extends Component {
  render() {
    const { remotePeers } = this.props;

    return (
      <Full>
        <Grid>
          {
            remotePeers.map((remotePeer, remotePeerIdx) => {
              const mediaStreams = remotePeer.getWebRTCMediaStreams();

              return (
                <Fragment key={remotePeerIdx}>
                  {
                    mediaStreams.map((mediaStream, remotePeerMediaStreamIdx) => {
                      return (
                        <GridItem
                          key={remotePeerMediaStreamIdx}
                          style={{ width: 320, height: 320 }}
                        >
                          <MediaStreamVideo mediaStream={mediaStream} />
                        </GridItem>
                      );
                    })
                  }
                </Fragment>
              );
            })
          }
        </Grid>
      </Full>
    );
  }
}

export default StreamGrid;