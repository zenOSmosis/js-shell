import getOpenedFilePathIdx from './getOpenedFilePathIdx';
import activateFile from './activateFile';
import { readFile, pathDetail } from 'utils/socketFS';
import './EditorFile.typedef';

const openFile = async (editorLinkedState, filePath) => {
  try {
    const { openedFiles } = editorLinkedState.getState();

    // If file already is opened, switch to it in the editor
    const openedFilePathIdx = getOpenedFilePathIdx(editorLinkedState, filePath);
    if (openedFilePathIdx > -1) {
      const file = openedFiles[openedFilePathIdx];
      activateFile(editorLinkedState, file);

      // Halt here.  The file is already activated.
      return;
    }
   
    const fileDetail = await pathDetail(filePath);

    // TODO: First inspect file size to see if it's too large to open

    const language = (() => {
      const { mimeType } = fileDetail;

      const defaultLanguage = 'raw';

      if (mimeType) {
        const parts = mimeType.split('/');

        const language = parts[1] ? parts[1] : defaultLanguage;
        return language;

      } else {
        return defaultLanguage;
      }
    })();

    const fileContent = await readFile(filePath, {
      // TODO: Incorporate dynamic value
      encoding: 'utf-8'
    });

    /**
     * @type {EditorFile}
     */
    const file = {
      isModified: false, // Not modified since opening, as it's just been opened
      language, // Code language
      fileDetail, // via pathDetail socketFS API call
      filePath, // Absolute filesystem path
      fileContent // Source code
    };

    openedFiles.push(file);
  
    editorLinkedState.setState({
      openedFiles,
      activeFile: file
    });
  } catch (exc) {
    throw exc;
  }
};

export default openFile;