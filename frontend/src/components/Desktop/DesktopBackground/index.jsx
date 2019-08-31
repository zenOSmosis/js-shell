import Background from 'components/Background';
import DesktopLinkedState from 'state/DesktopLinkedState';
import getFileDownloadRequestURL from 'utils/getFileDownloadRequestURL';
import hocConnect from 'state/hocConnect';

export default hocConnect(Background, DesktopLinkedState, (updatedState) => {
  const {backgroundURL} = updatedState;

  if (backgroundURL) {
    // TODO: Utilize socketFS instead
    const src = backgroundURL.substr(0,4)==='http' ? backgroundURL : getFileDownloadRequestURL(backgroundURL);

    return {
      src
    };
  }
});