import React, { Component } from 'react';
import Center from 'components/Center';
import ButtonGroup, { Button } from 'components/ButtonGroup';
import { /* Layout, Sider, Content, Footer, */ Row, Column } from 'components/Layout';
import { Icon } from 'antd';
import RangeSlider from './RangeSlider';
import TimeRemaining from './TimeRemaining';

/**
 * @extends React.Component
 */
class MediaPlayerFooter extends Component {
  render() {
    return (
      <Row>
        <Column style={{ maxWidth: 140, overflow: 'no-wrap' }}>
          <ButtonGroup style={{ margin: '5px 10px' }}>
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
        </Column>

        <Column style={{ padding: '0px 10px' }}>
          <Center>
            <RangeSlider />
          </Center>
        </Column>


        <Column style={{ maxWidth: 100 }}>
          <Center>
            <TimeRemaining />
          </Center>
        </Column>
      </Row>
    );
  }
}

export default MediaPlayerFooter;