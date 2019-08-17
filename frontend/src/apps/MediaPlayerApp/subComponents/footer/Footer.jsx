import React, { Component } from 'react';
import Center from 'components/Center';
import ButtonGroup, { Button } from 'components/ButtonGroup';
import { /* Layout, Sider, Content, Footer, */ Row, Column } from 'components/Layout';
import LabeledComponent from 'components/LabeledComponent';
import RangeSlider from './RangeSlider';
import { Knob } from 'react-rotary-knob';
import TimeRemaining from './TimeRemaining';
import { Icon } from 'antd';
import MediaPlayerState from '../../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';

/**
 * @extends React.Component
 */
class MediaPlayerFooter extends Component {
  _mediaPlayerLinkedState = null;

  componentDidUpdate() {
    if (!this._mediaPlayerLinkedState) {
      const { mediaPlayerLinkedState } = this.props;
      this._mediaPlayerLinkedState = mediaPlayerLinkedState;
    }
  }

  toggleInfoView() {
    if (this._mediaPlayerLinkedState) {
      const { isInfoViewMode } = this._mediaPlayerLinkedState.getState();

      this._mediaPlayerLinkedState.setState({
        isInfoViewMode: !isInfoViewMode
      });
    }
  }

  render() {
    return (
      <Row>
        <Column style={{ maxWidth: 140 }}>
          <Center>
            <ButtonGroup style={{ whiteSpace: 'nowrap' }}>
              <Button style={{ fontSize: 24, height: 34 }}>
                { /* Prev */}
                <Icon type="backward" />
              </Button>

              <Button style={{ fontSize: 24, height: 34 }}>
                { /* Play */}
                <Icon type="caret-right" />
              </Button>

              <Button style={{ fontSize: 24, height: 34 }}>
                { /* Next */}
                <Icon type="forward" />
              </Button>
            </ButtonGroup>
          </Center>
        </Column>

        <Column style={{ maxWidth: 60 }}>
          <Center>
            <LabeledComponent label="Volume">
              <Knob />
            </LabeledComponent>
          </Center>
        </Column>

        <Column style={{ padding: '0px 10px' }}>
          <Center>
            <RangeSlider />
          </Center>
        </Column>

        <Column style={{ maxWidth: 160 }}>
          <Center>
            <div style={{ display: 'inline-block' }}>
              <TimeRemaining style={{ marginRight: 20 }} />
            </div>

            <button
              style={{ display: 'inline-block', border: '0px', backgroundColor: 'transparent' }}
              onClick={ evt => this.toggleInfoView() }
            >
              <Icon type="info-circle" style={{fontSize: 34}} />
            </button>
          </Center>
        </Column>
      </Row>
    );
  }
}

const ConnectedMediaPlayerFooter = hocConnect(MediaPlayerFooter, MediaPlayerState, (updatedState, mediaPlayerLinkedState) => {
  return {
    mediaPlayerLinkedState
  };
});

export default ConnectedMediaPlayerFooter;