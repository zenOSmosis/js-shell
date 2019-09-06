import Background from 'components/Background';
import DesktopLinkedState from 'state/DesktopLinkedState';
import hocConnect from 'state/hocConnect';

export default hocConnect(Background, DesktopLinkedState, (updatedState) => {
  const {backgroundURL} = updatedState;

  if (backgroundURL) {
    return {
      src: backgroundURL
    };
  }
});