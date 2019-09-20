import React from 'react';
import registerApp from 'utils/desktop/registerApp';
// import FileManager from './FilesWindow';
import SocketFSFileChooserWindow from 'components/SocketFSFileChooserWindow';
import { ACTION_REQUEST_CREATE_FILE_DIALOG, ACTION_REQUEST_CREATE_DIR_DIALOG } from 'state/UniqueFileChooserLinkedState';
import FolderIcon from 'components/componentIcons/FolderIcon';

export default registerApp({
  allowMultipleWindows: true,
  title: 'Files',
  view: (props) => {
    const { appRuntime } = props;

    return (
      <SocketFSFileChooserWindow
        {...props}
        appRuntime={appRuntime}
        shouldCloseOnFileOpen={false}
        onMount={(fileChooserWindow) => {
          const fileChooserLinkedState = fileChooserWindow.getLinkedState();

          appRuntime.setState({
            fileChooserLinkedState
          });
        }}
      />
    );
  },
  iconView: () => <FolderIcon />,
  menus: [
    {
      title: 'File',
      items: [
        {
          title: 'Create new File',
          onClick: (evt, appRuntime) => {
            const { fileChooserLinkedState } = appRuntime.getState();

            fileChooserLinkedState.dispatchAction(ACTION_REQUEST_CREATE_FILE_DIALOG);
          }
        },
        {
          title: 'Create new Folder',
          onClick: (evt, appRuntime) => {
            const { fileChooserLinkedState } = appRuntime.getState();

            fileChooserLinkedState.dispatchAction(ACTION_REQUEST_CREATE_DIR_DIALOG);
          }
        }
      ]
    }
  ]
});