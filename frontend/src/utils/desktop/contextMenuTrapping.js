import DesktopLinkedState from 'state/DesktopLinkedState';

const setContextMenuIsTrapping = (isTrapping) => {
  DesktopLinkedState.setContextMenuIsTrapping(isTrapping);
};

const getContextMenuIsTrapping = () => {
  const { contextMenuIsTrapping } = DesktopLinkedState.getState();

  return contextMenuIsTrapping;
};

export {
  setContextMenuIsTrapping,
  getContextMenuIsTrapping
};