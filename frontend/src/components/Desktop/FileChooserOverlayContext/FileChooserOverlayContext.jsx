import React, { Fragment } from 'react';
import Cover from 'components/Cover';
import SocketFSFileChooserWindow from 'components/SocketFSFileChooserWindow';
import DesktopLinkedState, { hocConnect, STATE_IS_SHOWING_FILE_CHOOSER, ACTION_CLOSE_FILE_CHOOSER } from 'state/DesktopLinkedState';
import style from './FileChooserOverlayContent.module.scss';

const FileChooserOverlayContext = (props) => {
  const {
    [STATE_IS_SHOWING_FILE_CHOOSER]: isShowingFileChooser,
    desktopLinkedState,
    children,
  } = props;

  return (
    <Fragment>
      {
        children
      }

      {
        isShowingFileChooser &&
        <Cover className={style['overlay']}>
          <SocketFSFileChooserWindow
            shouldCloseOnFileOpen={true}

            // Close the overlay when the Window closes
            onClose={evt => desktopLinkedState.dispatchAction(ACTION_CLOSE_FILE_CHOOSER)}
          />
        </Cover>
      }
    </Fragment>
  ); 
};

export default hocConnect(FileChooserOverlayContext, DesktopLinkedState, (updatedState, desktopLinkedState) => {
  if (updatedState[STATE_IS_SHOWING_FILE_CHOOSER] !== undefined) {
    return {
      desktopLinkedState,
      [STATE_IS_SHOWING_FILE_CHOOSER]: updatedState[STATE_IS_SHOWING_FILE_CHOOSER]
    };
  }
});
