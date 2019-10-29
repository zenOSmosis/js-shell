import getOpenedAppFileWithPath from './getOpenedAppFileWithPath';
import getOpenedAppFileIdxWithPath from './getOpenedAppFileIdxWithPath';
import { writeFile } from 'utils/socketFS';
import updateAppFileWithIdx from './updateAppFileWithIdx';

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
    
    // Perform the actual file save
    await writeFile(appFilePath, appFileContent);

    // Update app file w/ non-modified status
    const appFileIdx = getOpenedAppFileIdxWithPath(uniqueMultiAppFileLinkedState, filePath);
    await updateAppFileWithIdx(uniqueMultiAppFileLinkedState, appFileIdx, {
      nonModifiedFileContent: appFileContent,
      isModified: false
    });
  } catch (exc) {
    throw exc;
  }
};

export default saveAppFile;