import {desktopLinkedState} from './.common';

const setContextMenuIsTrapping = (isTrapping) => {
  desktopLinkedState.setContextMenuIsTrapping(isTrapping);
};

const getContextMenuIsTrapping = () => {
  const {contextMenuIsTrapping} = desktopLinkedState.getState();

  return contextMenuIsTrapping;
};

export {
  setContextMenuIsTrapping,
  getContextMenuIsTrapping
};