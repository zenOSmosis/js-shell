import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import TextEditorWindow from './TextEditorWindow';
import TextIcon from 'components/componentIcons/TextIcon';

export default registerApp({
  title: 'Text Editor',
  view: (props) => {
    return (
      <TextEditorWindow {...props} />
    )
  },
  iconView: () => <TextIcon />
});