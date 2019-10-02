import React, { Component, Fragment } from 'react';
import Full from 'components/Full';
import Grid, { GridItem } from 'components/Grid';
import MediaStreamVideo from 'components/MediaStreamVideo';
import Cover from 'components/Cover';
import TransparentButton from 'components/TransparentButton/TransparentButton';

class StreamGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundStream: null
    }
  }

  render() {
    const { remotePeers } = this.props;
    const { backgroundStream } = this.state;

    return (
      <Full>
        <Cover>
          {
            backgroundStream &&
            <MediaStreamVideo mediaStream={backgroundStream} />
          }
        </Cover>
        <Cover>
          <Grid>
            {
              remotePeers.map((remotePeer, remotePeerIdx) => {
                const mediaStreams = remotePeer.getWebRTCMediaStreams();

                return (
                  <Fragment key={remotePeerIdx}>
                    {
                      mediaStreams.map((mediaStream, remotePeerMediaStreamIdx) => {
                        if (Object.is(mediaStream, backgroundStream)) {
                          return false;
                        }

                        return (
                          <GridItem
                            key={remotePeerMediaStreamIdx}
                            style={{ width: '100%', height: '100%' }}
                          >
                            <MediaStreamVideo mediaStream={mediaStream} />
                            <Cover>
                              <TransparentButton
                                style={{ width: '100%', height: '100%' }}
                                // TODO: Show video / audio info when pressed
                                // onClick={evt => console.debug(mediaStream.getTracks())}
                                onClick={ evt => this.setState({backgroundStream: mediaStream}) }
                              >
                              </TransparentButton>
                            </ Cover>
                          </GridItem>
                        );
                      })
                    }
                  </Fragment>
                );
              })
            }
          </Grid>
        </Cover>
      </Full>
    );
  }
}

export default StreamGrid;