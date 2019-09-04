import getOpenedAppFileWithPath from './getOpenedAppFileWithPath';
import { writeFile } from 'utils/socketFS';

const saveAppFile = async (editorLinkedState, filePath) => {
  try {
    const appFile = getOpenedAppFileWithPath(editorLinkedState, filePath);

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