import React, { Component } from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import FileTab from './FileTab';
import styles from './FileTabs.module.css';

/**
 * @extends React.Component
 */
class FileTabs extends Component {
  _handleFilePathCloseWithIdx(idx) {
    const { editorLinkedState } = this.props;
    const { openedFilePaths } = editorLinkedState.getState();

    openedFilePaths.splice(idx, 1);

    editorLinkedState.setState({
      openedFilePaths
    });
  }

  render() {
    const { editorLinkedState } = this.props;

    return (
      <LinkedStateRenderer
        linkedState={editorLinkedState}
        onUpdate={(updatedState) => {
          const { openedFilePaths } = updatedState;

          console.debug({
            openedFilePaths
          });

          if (openedFilePaths !== undefined) {
            return {
              openedFilePaths
            };
          }
        }}
        render={(renderProps) => {
          const openedFilePaths = renderProps.openedFilePaths || [];
          
          return (
            <div
              className={styles['file-tabs']}

              // TODO: Handle horizontal overflow scrolling
              onWheel={evt => console.debug(evt.deltaY)}
            >
              {
                openedFilePaths.map((filePath, idx) => {
                  return (
                    <FileTab
                      // Important! Key must not be the idx or it will update
                      // incorrectly when removing existing file paths
                      key={`${filePath}-${idx}`}
                      
                      filePath={filePath}
                      editorLinkedState={editorLinkedState}
                      onClose={ evt => this._handleFilePathCloseWithIdx(idx) }
                    />
                  );
                })
              }
            </div>
          );
        }}
      />
    );
  }
}

export default FileTabs;