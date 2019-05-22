import { commonDesktopLinkedState } from './.common';

const setContextMenuIsTrapping = (isTrapping) => {
  commonDesktopLinkedState.setContextMenuIsTrapping(isTrapping);
};

const getContextMenuIsTrapping = () => {
  const { contextMenuIsTrapping } = commonDesktopLinkedState.getState();

  return contextMenuIsTrapping;
};

export {
  setContextMenuIsTrapping,
  getContextMenuIsTrapping
};