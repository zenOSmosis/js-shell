import React from 'react';
import { EVT_BEFORE_EXIT } from 'process/ClientProcess';
import registerApp from 'utils/desktop/registerApp';
import LocalStorageManagerWindow from './LocalStorageManagerWindow';
import VaultIcon from 'components/componentIcons/VaultIcon';
import EncryptedLocalStorageLinkedState from 'state/EncryptedLocalStorageLinkedState';

export default registerApp({
  title: 'Local Storage Manager',
  view: (props) => {
    return (
      <LocalStorageManagerWindow {...props} />
    );
  },
  iconView: () => <VaultIcon />,
  cmd: (appRuntime) => {
    let encryptedLocalStorageLinkedState = new EncryptedLocalStorageLinkedState();
    appRuntime.on(EVT_BEFORE_EXIT, () => {
      encryptedLocalStorageLinkedState.destroy();
      encryptedLocalStorageLinkedState = null;
    });

    appRuntime.setState({
      encryptedLocalStorageLinkedState
    });
  }
});