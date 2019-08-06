import Background from 'components/Background';
import DesktopLinkedState from 'state/DesktopLinkedState';
import getRequestURI from 'utils/fileSystem/getRequestURI';
import hocConnect from 'state/hocConnect';

export default hocConnect(Background, DesktopLinkedState, (updatedState) => {
  const {backgroundURI} = updatedState;

  if (backgroundURI) {
    const src = backgroundURI.substr(0,4)==='http' ? backgroundURI : getRequestURI(backgroundURI);

    return {
      src
    };
  }
});