import React from 'react';
import Center from '../../../components/Center';
import {desktopLinkedState} from '../../../state/DesktopLinkedState';
import { Switch } from 'antd';

const ContextMenuSettings = (props = {}) => {
  const {contextMenuIsTrapping} = desktopLinkedState.getState();

  return (
    <Center>
      <label>Context Menu Trapping</label>
      <Switch defaultChecked={contextMenuIsTrapping} onChange={ contextMenuIsTrapping => desktopLinkedState.setState({contextMenuIsTrapping}) } />
    </Center>
  );
};

export default ContextMenuSettings;