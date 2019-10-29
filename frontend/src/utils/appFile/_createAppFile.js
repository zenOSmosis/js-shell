import './AppFile.typedef';
import uuidv4 from 'uuidv4';

/**
 * Important! This does not register this AppFile.
 * 
 * Utilize openAppFile if looking to read from the filesystem.
 * 
 * @return {AppFile}
 */
const _createAppFile = () => {
  return {
    uuid: uuidv4(),
    isModified: false, // Not modified since opening, as it's just been opened
    fileDetail: null,
    filePath: null,
    fileContent: '',
    nonModifiedFileContent: '',
    meta: {}
  }
};

export default _createAppFile;