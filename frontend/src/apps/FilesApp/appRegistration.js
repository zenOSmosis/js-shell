import React from 'react';
import registerApp from 'utils/desktop/registerApp';
// import FileManager from './FilesWindow';
import SocketFSFilePickerWindow from 'components/SocketFSFilePickerWindow';
import { ACTION_CREATE_FILE, ACTION_CREATE_DIRECTORY } from 'components/SocketFSFilePickerWindow/state/UniqueSocketFSFilePickerLinkedState';
import config from 'config';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Files',
  view: (props) => {
    const { appRuntime } = props;

    return (
      <SocketFSFilePickerWindow
        {...props}
        appRuntime={appRuntime}
        onMount={(filePickerWindow) => {
          const filePickerLinkedState = filePickerWindow.getLinkedState();

          appRuntime.setState({
            filePickerLinkedState
          });
        }}
      />
    );
  },
  iconSrc: `${config.HOST_ICON_URL_PREFIX}folder/folder.svg`,
  menus: [
    {
      title: 'File',
      items: [
        {
          title: 'Create new File',
          onClick: (evt, appRuntime) => {
            const { filePickerLinkedState } = appRuntime.getState();

            filePickerLinkedState.dispatchAction(ACTION_CREATE_FILE);
          }
        },
        {
          title: 'Create new Folder',
          onClick: (evt, appRuntime) => {
            const { filePickerLinkedState } = appRuntime.getState();

            filePickerLinkedState.dispatchAction(ACTION_CREATE_DIRECTORY);
          }
        }
      ]
    }
  ]
});