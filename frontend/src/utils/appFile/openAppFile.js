import { OPENED_APP_FILES, ACTIVE_APP_FILE } from 'state/UniqueMultiAppFileLinkedState';
import getOpenedAppFileIdxWithPath from './getOpenedAppFileIdxWithPath';
import activateAppFile from './activateAppFile';
import { readFile, pathDetail } from 'utils/socketFS';
import createAppFile from './_createAppFile';
import './AppFile.typedef';

/**
 * 
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {string} filePath 
 * @param {Object} readFileOptions
 * @return {Promise<void>}
 */
const openAppFile = async (uniqueMultiAppFileLinkedState, filePath, readFileOptions = { encoding: 'utf-8' }) => {
  try {
    const { [OPENED_APP_FILES]: openedAppFiles } = uniqueMultiAppFileLinkedState.getState();

    // If file already is opened, switch to it in the editor
    const openedAppFilePathIdx = getOpenedAppFileIdxWithPath(uniqueMultiAppFileLinkedState, filePath);
    if (openedAppFilePathIdx > -1) {
      const appFile = openedAppFiles[openedAppFilePathIdx];
      activateAppFile(uniqueMultiAppFileLinkedState, appFile);

      // Halt here.  The file is already activated.
      return;
    }
   
    const fileDetail = await pathDetail(filePath);

    // TODO: First inspect file size to see if it's too large to open

    /*
    const language = (() => {
      const { mimeType } = fileDetail;

      // TODO: Refactor default language elsewhere
      const defaultLanguage = 'raw';

      if (mimeType) {
        const parts = mimeType.split('/');

        const language = parts[1] ? parts[1] : defaultLanguage;
        return language;

      } else {
        return defaultLanguage;
      }
    })();
    */

    const fileContent = await readFile(filePath, readFileOptions);

    /**
     * @type {AppFile}
     */
    const appFile = {...createAppFile(), ...{
      fileDetail, // via pathDetail socketFS API call
      filePath, // Absolute filesystem path
      fileContent // Source code
    }};

    openedAppFiles.push(appFile);
  
    uniqueMultiAppFileLinkedState.setState({
      [OPENED_APP_FILES]: openedAppFiles,
      [ACTIVE_APP_FILE]: appFile
    });
  } catch (exc) {
    throw exc;
  }
};

export default openAppFile;