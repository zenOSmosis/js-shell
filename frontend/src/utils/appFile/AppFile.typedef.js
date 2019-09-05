/**
 * @typedef {Object} AppFile
 * @property {string} uuid Unique identifier of the AppFile.
 * @property {boolean} isModified Whether the file has been modified since the
 * last save.
 * @property {Object} fileDetail The pathDetail of the file, via socketFS API.
 * @property {string} filePath The absolute file path of the file.
 * @property {string} fileContent The source code within the editor. 
 */