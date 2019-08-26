import React from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';

const EditorFooter = (props) => {
  const { editorLinkedState } = props;

  return (
    <LinkedStateRenderer
      linkedState={editorLinkedState}
      onUpdate={(updatedState) => {
        const { cursorPosition } = updatedState;

        if (cursorPosition !== undefined) {
          const { positionColumn, positionLineNumber } = cursorPosition;

          if (positionColumn !== undefined &&
              positionLineNumber !== undefined) {
            return ({
              positionColumn,
              positionLineNumber
            });
          }
        }
      }}
      render={renderProps => {
        const { positionLineNumber, positionColumn } = renderProps;

        return (
          <div style={{ display: 'inline-block' }}>
            Ln {positionLineNumber}, Col {positionColumn}
          </div>
        )
      }}
    />
  )
};

export default EditorFooter;