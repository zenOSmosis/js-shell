import { OPENED_APP_FILES, ACTIVE_APP_FILE } from 'state/UniqueMultiAppFileLinkedState';
import getOpenedAppFileIdxWithPath from './getOpenedAppFileIdxWithPath';
import activateAppFile from './activateAppFile';
import { readFile, pathDetail } from 'utils/socketFS';
import _createAppFile from './_createAppFile';
import './AppFile.typedef';

/**
 * Reads file via filePath and creates a new AppFile from its contents.
 * 
 * IMPORTANT! This loads the entire file into memory at once and is not
 * suitable for large file support.
 * 
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {string} filePath 
 * @param {Object} readFileOptions? TODO: Document accordingly
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

    // Create the active app file first, before loading, so that listeners can
    // be aware of it.
    // E.g. The SourceCode (Editor) app utilizes this to know whether to open
    // a default, untitled file, before the network latency of the open file
    // request.
    let appFile = _createAppFile();
    uniqueMultiAppFileLinkedState.setState({
      [ACTIVE_APP_FILE]: appFile
    });
   
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
    appFile = {...appFile, ...{
      fileDetail, // via pathDetail socketFS API call
      filePath, // Absolute filesystem path
      fileContent, // Source code
      nonModifiedFileContent: fileContent
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