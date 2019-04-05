import React, { Component } from 'react';
import { Button, ButtonGroup } from '../ButtonGroup';
import { Divider } from 'antd';

class SegmentedControl extends Component {
  render() {
    const { children, ...propsRest } = this.props;

    return (
      <div
        {...propsRest}
      >
        <Divider>
          <ButtonGroup>
            {
              children
            }
          </ButtonGroup>
        </Divider>
      </div>
    );
  }
};

const SegmentedControlItem = (props = {}) => {
  const { children, ...propsRest } = props;

  return (
    <Button
      {...propsRest}
    >
      {
        children
      }
    </Button>
  )
};

export {
  SegmentedControl,
  SegmentedControlItem
}