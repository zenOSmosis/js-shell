import Background from 'components/Background';
import DesktopLinkedState from 'state/DesktopLinkedState';
import getRequestURI from 'utils/fileSystem/getRequestURI';
import hocConnect from '../../../state/hocConnect';

export default hocConnect(Background, DesktopLinkedState, (updatedState) => {
  const {backgroundURI} = updatedState;

  if (backgroundURI) {
    const src = getRequestURI(backgroundURI);

    return {
      src
    };
  }
});