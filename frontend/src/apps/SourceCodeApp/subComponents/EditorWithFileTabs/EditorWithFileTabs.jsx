import React, { Component } from 'react';
import { Layout, Header, Content } from 'components/Layout';
import Full from 'components/Full';
import LinkedStateRenderer from 'components/LinkedStateRenderer';
import MonacoEditor from 'components/MonacoEditor';
import FileTabs from '../FileTabs';
import style from './EditorWithFileTabs.module.css';
import { CURSOR_POSITION } from '../../state/UniqueSourceCodeAppLinkedState';
import classNames from 'classnames';
import updateFileWithIdx from '../../utils/file/updateFileWithIdx';

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
              const { activeFile, openedFiles } = updatedState;

              const filteredState = {};

              if (activeFile !== undefined) {
                filteredState.activeFile = activeFile;
              }

              if (openedFiles !== undefined) {
                filteredState.openedFiles = openedFiles;
              }

              return filteredState;
            }}
            render={(renderProps) => {
              const { activeFile, openedFiles } = renderProps;

              return (
                <Full>
                  {
                    openedFiles &&
                    openedFiles.map((file, idx) => {
                      const isHidden = !Object.is(activeFile, file);
                      const { language, fileContent } = file;

                      const { filePath } = file;

                      return (
                        <MonacoEditor
                          ref={ c => this._editorRefs[idx] = c }
                          containerClassName={classNames(style['editor'], isHidden ? style['hidden'] : null)}
                          key={filePath}
                          editorDidMount={(editor, monaco, monacoEditorComponent) => this._handleEditorMount(editor, monaco, monacoEditorComponent)}
                          language={language}
                          initialValue={fileContent}
                          onDidChangeCursorSelection={selection => {
                            editorLinkedState.setState({
                              [CURSOR_POSITION]: selection
                            });
                          }}
                          onDidChangeContent={evt => {
                            // TODO: Use this to trigger dirty / clean state w/ files
                            // updateFileWithIdx()
                            const updatedFileContent = this._editorRefs[idx].getValue();

                            updateFileWithIdx(editorLinkedState, idx, updatedFileContent);
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