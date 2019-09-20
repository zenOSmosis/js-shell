import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import DocsWindow from './DocsWindow';
import DocumentationIcon from 'components/componentIcons/DocumentationIcon';

export default registerApp({
  title: 'Docs',
  view: (props) => {
    return (
      <DocsWindow {...props} />
    );
  },
  iconView: () => <DocumentationIcon />
});