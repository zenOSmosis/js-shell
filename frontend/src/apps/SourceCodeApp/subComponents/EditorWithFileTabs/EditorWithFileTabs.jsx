import React, { Component } from 'react';
import { Layout, Header, Content } from 'components/Layout';
import Full from 'components/Full';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import MonacoEditor from 'components/MonacoEditor';
import FileTabs from '../FileTabs';
import style from './EditorWithFileTabs.module.css';
import {
  ACTIVE_APP_FILE,
  OPENED_APP_FILES,
  CURSOR_POSITION
} from '../../state/UniqueSourceCodeAppLinkedState';
import classNames from 'classnames';
import {
  updateAppFileWithIdx
} from 'utils/appFile';

class EditorWithFileTabs extends Component {
  _editorRefs = [];

  _handleEditorMount(editor, monaco, monacoEditorComponent) {
    const { editorLinkedState } = this.props;
    let { languages } = editorLinkedState.getState();

    if (!languages.length) {
      const editorlanguages = monacoEditorComponent.getLanguages();

      languages = editorlanguages.map(language => {
        return language.aliases[0];
      });

      editorLinkedState.setState({
        languages
      });
    }
  }

  render() {
    const { editorLinkedState } = this.props;

    return (
      <Layout>
        <Header>
          <FileTabs
            editorLinkedState={editorLinkedState}
          />
        </Header>
        <Content>
          <LinkedStateRenderer
            linkedState={editorLinkedState}
            onUpdate={(updatedState) => {
              const {
                [ACTIVE_APP_FILE]: activeAppFile,
                [OPENED_APP_FILES]: openedAppFiles
              } = updatedState;

              const filteredState = {};

              if (activeAppFile !== undefined) {
                filteredState[ACTIVE_APP_FILE] = activeAppFile;
              }

              if (openedAppFiles !== undefined) {
                filteredState[OPENED_APP_FILES] = openedAppFiles;
              }

              return filteredState;
            }}
            render={(renderProps) => {
              const {
                [ACTIVE_APP_FILE]: activeAppFile,
                [OPENED_APP_FILES]: openedAppFiles
              } = renderProps;

              return (
                <Full>
                  {
                    openedAppFiles &&
                    openedAppFiles.map((appFile, idx) => {
                      // Is set to true if the file is not the active file
                      const isHidden = !Object.is(activeAppFile, appFile);

                      const { language, fileContent } = appFile;

                      const { uuid: appFileUUID } = appFile;

                      return (
                        <MonacoEditor
                          ref={c => this._editorRefs[idx] = c}

                          // Hide editors which are not active
                          containerClassName={classNames(style['editor'], isHidden ? style['hidden'] : null)}

                          key={appFileUUID}
                          editorDidMount={(editor, monaco, monacoEditorComponent) => this._handleEditorMount(editor, monaco, monacoEditorComponent)}
                          language={language}
                          initialValue={fileContent}
                          onDidChangeCursorSelection={selection => {
                            editorLinkedState.setState({
                              [CURSOR_POSITION]: selection
                            });

                            updateAppFileWithIdx(editorLinkedState, idx, {
                              meta: {
                                [CURSOR_POSITION]: selection
                              }
                            });
                          }}
                          onDidChangeContent={evt => {
                            // TODO: Use this to trigger dirty / clean state w/ files
                            // updateAppFileWithIdx()
                            const fileContent = this._editorRefs[idx].getValue();

                            updateAppFileWithIdx(editorLinkedState, idx, {
                              fileContent
                            });
                          }}
                        />
                      );
                    })
                  }
                </Full>
              );
            }}
          />
        </Content>
      </Layout>
    );
  }
}

export default EditorWithFileTabs;