import getOpenedAppFileWithPath from './getOpenedAppFileWithPath';
import { writeFile } from 'utils/socketFS';

/**
 * @param {UniqueMultiAppFileLinkedState} uniqueMultiAppFileLinkedState 
 * @param {string} filePath
 * @return {Promise<void>}
 */
const saveAppFile = async (uniqueMultiAppFileLinkedState, filePath) => {
  try {
    const appFile = getOpenedAppFileWithPath(uniqueMultiAppFileLinkedState, filePath);

    if (!appFile) {
      throw new Error(`Unable to acquire opened app file with path: ${filePath}`);
    }

    const {
      filePath: appFilePath,
      fileContent: appFileContent
    } = appFile;
    
    await writeFile(appFilePath, appFileContent);
  } catch (exc) {
    throw exc;
  }
};

export default saveAppFile;