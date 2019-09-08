import React, { Fragment } from 'react';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import hocConnect from 'state/hocConnect';
import setNativeWindowTitle from 'utils/desktop/setNativeWindowTitle';

/**
 * Sets the window title based on the passed props.
 * 
 * @param {Object} props 
 */
const NativeWindowTitleController = (props) => {
  const { title } = props;
  setNativeWindowTitle(title);

  return (
    <Fragment></Fragment>
  )
};

export default hocConnect(NativeWindowTitleController, AppRuntimeLinkedState, (updatedState) => {
  const { focusedAppRuntime } = updatedState;

  if (focusedAppRuntime !== undefined) {
    const title = focusedAppRuntime.getTitle();

    return {
      title
    };
  }
});