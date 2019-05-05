// import React from 'react';
import Background from 'components/Background';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
import getRequestURI from 'utils/fileSystem/getRequestURI';

export default hocConnect(Background, DesktopLinkedState, (updatedState) => {
  const {backgroundURI} = updatedState;

  if (backgroundURI) {
    return {
      src: getRequestURI(backgroundURI)
    };
  }
});