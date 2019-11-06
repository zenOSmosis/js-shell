import React, { Component } from 'react';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import { ACTIVE_APP_FILE, LANGUAGES } from '../../state/UniqueSourceCodeAppLinkedState';
import { Row, Column } from 'components/Layout';
import styles from './AppFooter.module.css';

class AppFooter extends Component {
  _handleEditorLanguageChange(language) {
    const { editorLinkedState } = this.props;

    const activeAppFile = editorLinkedState.getState(ACTIVE_APP_FILE);

    // TODO: Set activeAppFile meta.language to this value

    // TODO: Implement
    console.debug({
      _handleEditorLanguageChange: language,
      activeAppFile
    });
  }

  render() {
    const { editorLinkedState } = this.props;

    return (
      <LinkedStateRenderer
        linkedState={editorLinkedState}
        onUpdate={(updatedState) => {
          let filteredState = {};

          if (updatedState[LANGUAGES]) {
            filteredState.languages = updatedState[LANGUAGES];
          }

          if (updatedState[ACTIVE_APP_FILE]) {
            const {
              language,
              meta: activeAppFileMeta
            } = updatedState[ACTIVE_APP_FILE];

            filteredState.language = language;

            // Obtain cursor position from activeAppFile meta property
            const { cursorPosition } = activeAppFileMeta;
            
            if (cursorPosition) {
              const { positionColumn, positionLineNumber } = cursorPosition;

              filteredState.positionColumn = positionColumn;
              filteredState.positionLineNumber = positionLineNumber;
            }
          } else {
            filteredState.positionColumn = null;
            filteredState.positionLineNumber = null;
          }

          return filteredState;
        }}
        render={renderProps => {
          const {
            positionLineNumber,
            positionColumn,
            language,
            languages: propsLanguages
          } = renderProps;
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
                <select
                  // TODO: Default to activeAppFile.meta.language

                  // TODO: Handle editor language selection
                  onChange={evt => this._handleEditorLanguageChange(evt.target.value)}
                >
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
    );
  }
}

export default AppFooter;