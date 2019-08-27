import React from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import { CURSOR_POSITION } from '../../utils/SourceCodeAppLinkedState';

const AppFooter = (props) => {
  const { editorLinkedState } = props;

  return (
    <LinkedStateRenderer
      linkedState={editorLinkedState}
      onUpdate={(updatedState) => {
        if (updatedState[CURSOR_POSITION] !== undefined) {
          const { positionColumn, positionLineNumber } = updatedState[CURSOR_POSITION];

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
          <div>
            <div style={{ display: 'inline-block' }}>
              Ln {positionLineNumber}, Col {positionColumn}
            </div>

            <div style={{ display: 'inline-block' }}>
              [ Spaces ]
            </div>

            <div style={{ display: 'inline-block' }}>
              [ EOL Sequence ]
            </div>

            <div style={{ display: 'inline-block' }}>
              [ Encoding ]
            </div>

            <div style={{ display: 'inline-block' }}>
              [ Script Type ]
            </div>
          </div>
        );
      }}
    />
  )
};

export default AppFooter;