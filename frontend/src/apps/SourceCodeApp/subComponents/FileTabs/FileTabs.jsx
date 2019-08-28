import React, { Component } from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import ScrollablePanel from 'components/ScrollablePanel';
import FileTab from './FileTab';

/**
 * @extends React.Component
 */
class FileTabs extends Component {
  render() {
    const { editorLinkedState } = this.props;

    return (
      <LinkedStateRenderer
        linkedState={editorLinkedState}
        onUpdate={(updatedState) => {
          const { openedFiles } = updatedState;

          if (openedFiles !== undefined) {
            return {
              openedFiles
            };
          }
        }}
        render={(renderProps) => {
          const openedFiles = renderProps.openedFiles || [];

          return (
            <ScrollablePanel>
              {
                openedFiles.map((file, idx) => {
                  const { filePath } = file;

                  return (
                    <FileTab
                      // Important! Key must not be the idx or it will update
                      // incorrectly when removing existing file paths
                      key={`${filePath}-${idx}`}
                      file={file}
                      editorLinkedState={editorLinkedState}
                    />
                  );
                })
              }
            </ScrollablePanel>
          );
        }}
      />
    );
  }
}

export default FileTabs;