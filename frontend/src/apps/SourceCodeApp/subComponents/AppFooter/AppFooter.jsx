import React from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import { ACTIVE_FILE, CURSOR_POSITION, LANGUAGES } from '../../state/UniqueSourceCodeAppLinkedState';
import { Row, Column } from 'components/Layout';
import style from './AppFooter.module.css';

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

        if (updatedState[ACTIVE_FILE]) {
          const { language } = updatedState[ACTIVE_FILE];

          filteredState.language = language;
        }

        if (updatedState[CURSOR_POSITION]) {
          const { positionColumn, positionLineNumber } = updatedState[CURSOR_POSITION];

          if (positionColumn !== undefined &&
              positionLineNumber !== undefined) {
              filteredState = {...filteredState, ...{
                positionColumn,
                positionLineNumber
              }};
          }
        }

        return filteredState;
      }}
      render={renderProps => {
        const { positionLineNumber, positionColumn, language, languages: propsLanguages } = renderProps;
        const languages = propsLanguages ? propsLanguages : [];

        return (
          <Row className={style['app-footer']}>
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
              { language }
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