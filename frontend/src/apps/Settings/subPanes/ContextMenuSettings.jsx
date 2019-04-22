import React from 'react';
import Center from '../../../components/Center';
import DesktopLinkedState, {EVT_LINKED_STATE_UPDATE} from '../../../state/DesktopLinkedState';
import hocConnect from '../../../state/hocConnect';
import {setContextMenuIsTrapping} from '../../../utils/desktop/contextMenuTrapping';
import { Switch } from 'antd';

// const desktopLinkedState = new DesktopLinkedState();
// console.warn('TODO: Dynamically handle this linked state instance', desktopLinkedState);

const ContextMenuSettings = (props = {}) => {
  const {contextMenuIsTrapping} = props;

  return (
    <Center>
      <label>Context Menu Trapping</label>
      <Switch
        checked={contextMenuIsTrapping}
        onChange={ contextMenuIsTrapping => setContextMenuIsTrapping(contextMenuIsTrapping) }
      />
    </Center>
  );
};

export default hocConnect(ContextMenuSettings, DesktopLinkedState);