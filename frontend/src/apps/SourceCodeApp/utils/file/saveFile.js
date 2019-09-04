import getOpenedFileWithPath from './getOpenedFileWithPath';
import { writeFile } from 'utils/socketFS';

const saveFile = async (editorLinkedState, filePath) => {
  try {
    const file = getOpenedFileWithPath(editorLinkedState, filePath);

    if (!file) {
      throw new Error(`Unable to acquire opened file with path: ${filePath}`);
    }
    
    await writeFile(file.filePath, file.fileContent);
  } catch (exc) {
    throw exc;
  }
};

export default saveFile;