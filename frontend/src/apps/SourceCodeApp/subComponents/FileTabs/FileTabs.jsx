import React, { Component } from 'react';
import { OPENED_APP_FILES } from '../../state/UniqueSourceCodeAppLinkedState';
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
          const { [OPENED_APP_FILES]: openedAppFiles } = updatedState;

          if (openedAppFiles !== undefined) {
            return {
              [OPENED_APP_FILES]: openedAppFiles
            };
          }
        }}
        render={(renderProps) => {
          const openedAppFiles = renderProps[OPENED_APP_FILES] || [];

          return (
            <ScrollablePanel>
              {
                openedAppFiles.map((appFile, idx) => {
                  const { filePath } = appFile;

                  return (
                    <FileTab
                      // Important! Key must not be the idx or it will update
                      // incorrectly when removing existing file paths
                      key={`${filePath}-${idx}`}
                      appFile={appFile}
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