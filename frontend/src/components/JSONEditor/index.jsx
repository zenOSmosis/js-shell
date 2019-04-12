import { JsonEditor as JSONEditor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

export const JSONEDITOR_MODE_TREE = 'tree';
export const JSONEDITOR_MODE_VIEW = 'view'; // Read-only
export const JSONEDITOR_MODE_FORM = 'form'; // Structure is read-only; data can be changed
export const JSONEDITOR_MODE_CODE = 'code';
export const JSONEDITOR_MODE_TEXT = 'text';

export const JSONEDITOR_MODES = [
  JSONEDITOR_MODE_TREE,
  JSONEDITOR_MODE_VIEW,
  JSONEDITOR_MODE_FORM,
  JSONEDITOR_MODE_CODE,
  JSONEDITOR_MODE_TEXT
];

export default JSONEditor;