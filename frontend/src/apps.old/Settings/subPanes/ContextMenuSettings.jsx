import React from 'react';
import Center from 'components/Center';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
import {setContextMenuIsTrapping} from 'utils/desktop/contextMenuTrapping';
import { Switch } from 'antd';

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