/**
 * @typedef {Object} EditorFile
 * @property {boolean} isModified Whether the file has been modified since the
 * last save.
 * @property {string} language The code language of the editor's content.
 * @property {Object} fileDetail The pathDetail of the file, via socketFS API.
 * @property {string} filePath The absolute file path of the file.
 * @property {string} fileContent The source code within the editor. 
 */