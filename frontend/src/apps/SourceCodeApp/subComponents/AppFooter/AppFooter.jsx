import React from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import { ACTIVE_APP_FILE, CURSOR_POSITION, LANGUAGES } from '../../state/UniqueSourceCodeAppLinkedState';
import { Row, Column } from 'components/Layout';
import styles from './AppFooter.module.css';

const AppFooter = (props) => {
  const { editorLinkedState } = props;

  return (
    <LinkedStateRenderer
      linkedState={editorLinkedState}
      onUpdate={(updatedState) => {
        let filteredState = {};

        if (updatedState[LANGUAGES]) {
          filteredState.languages = updatedState[LANGUAGES];
        }

        let cursorPosition = null;

        if (updatedState[ACTIVE_APP_FILE]) {
          const { language, meta: activeAppFileMeta } = updatedState[ACTIVE_APP_FILE];

          filteredState.language = language;

          // Obtain cursor position from activeAppFile meta property
          const { [CURSOR_POSITION]: metaCursorPosition } = activeAppFileMeta;
          if (metaCursorPosition) {
            cursorPosition = metaCursorPosition;
          }
        } else if (updatedState[CURSOR_POSITION]) {
          // Obtain cursor position from updated editorLinkedState
          cursorPosition = updatedState[CURSOR_POSITION];
        }

        if (cursorPosition) {
          const { positionColumn, positionLineNumber } = cursorPosition;

          if (positionColumn !== undefined &&
            positionLineNumber !== undefined) {
            filteredState = {
              ...filteredState, ...{
                positionColumn,
                positionLineNumber
              }
            };
          }
        }

        return filteredState;
      }}
      render={renderProps => {
        const { positionLineNumber, positionColumn, language, languages: propsLanguages } = renderProps;
        const languages = propsLanguages ? propsLanguages : [];

        return (
          <Row className={styles['app-footer']}>
            <Column>
              Ln {positionLineNumber}, Col {positionColumn}
            </Column>

            <Column>
              [ Spaces ]
            </Column>

            {
              /*
              <Column>
                [ EOL Sequence ]
              </Column>
              */
            }

            <Column>
              [ Encoding ]
            </Column>

            <Column>
              {language}
              <select>
                {
                  languages.map((_language, idx) => {
                    return (
                      <option
                        key={idx}
                        value={_language}
                      >
                        {_language}
                      </option>
                    );
                  })
                }
              </select>
            </Column>
          </Row>
        );
      }}
    />
  )
};

export default AppFooter;