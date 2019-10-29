/**
 * @typedef {Object} AppFile
 * @property {string} uuid Unique identifier of the AppFile.
 * @property {boolean} isModified Whether the file has been modified since the
 * last save. NOTE: This is internally set to true when the fileContent matches
 * the nonModifiedFileContent.
 * @property {Object} fileDetail The pathDetail of the file, via socketFS API.
 * @property {string} filePath The absolute file path of the file.
 * @property {string} fileContent The source code within the editor.
 * @property {string} nonModifiedFileContent The source code at the last save
 * point (or empty if not saved).
 * @property {Object} meta? Arbitrary metadata.
 */