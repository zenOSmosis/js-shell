import Background from 'components/Background';
import DesktopLinkedState from 'state/DesktopLinkedState';
import getRequestURL from 'utils/old.fs/getRequestURL';
import hocConnect from 'state/hocConnect';

export default hocConnect(Background, DesktopLinkedState, (updatedState) => {
  const {backgroundURL} = updatedState;

  if (backgroundURL) {
    const src = backgroundURL.substr(0,4)==='http' ? backgroundURL : getRequestURL(backgroundURL);

    return {
      src
    };
  }
});