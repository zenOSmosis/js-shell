import { pathDetail } from 'utils/socketFS';
import getAppRegistrationsWithMimeType from './getAppRegistrationsWithMimeType';

/**
 * Opens a given file path in a registered app.
 * 
 * @param {string} filePath 
 */
const openFile = async (filePath) => {
  try {
    const fileDetail = await pathDetail(filePath);

    const avialableAppRegistrations = getAppRegistrationsWithMimeType(fileDetail.mimeType)

    // TODO: If more than one app registration is available for this file type, show a modal menu asking the user to select which one to open with

    if (avialableAppRegistrations.length) {
      avialableAppRegistrations[0].processFileOpenRequest(filePath);
    }

    // alert('DesktopLinkedState open file request: ' + filePath);
  } catch (exc) {
    throw exc;
  }
};

export default openFile;