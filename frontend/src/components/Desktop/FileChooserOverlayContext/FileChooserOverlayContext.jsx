import React, { Fragment } from 'react';
import Cover from 'components/Cover';
import SocketFSFileChooserWindow from 'components/SocketFSFileChooserWindow';
import DesktopLinkedState, { hocConnect, STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS, ACTION_CLOSE_FILE_CHOOSER_DIALOG } from 'state/DesktopLinkedState';
import style from './FileChooserOverlayContent.module.scss';

/**
 * IMPORTANT!  This should run as a singleton!
 */
const FileChooserOverlayContext = (props) => {
  const {
    [STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]: activeFileChooserDialogParams,
    desktopLinkedState,
    children,
  } = props;

  return (
    <Fragment>
      {
        children
      }

      {
        activeFileChooserDialogParams &&
        <Cover className={style['overlay']}>
          <SocketFSFileChooserWindow
            dialogParams={activeFileChooserDialogParams}

            shouldCloseOnFileOpen={true}

            // Close the overlay when the Window closes
            onClose={evt => desktopLinkedState.dispatchAction(ACTION_CLOSE_FILE_CHOOSER_DIALOG)}
          />
        </Cover>
      }
    </Fragment>
  ); 
};

export default hocConnect(FileChooserOverlayContext, DesktopLinkedState, (updatedState, desktopLinkedState) => {
  if (updatedState[STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS] !== undefined) {
    return {
      desktopLinkedState,
      [STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]: updatedState[STATE_ACTIVE_FILE_CHOOSER_DIALOG_PARAMS]
    };
  }
});
