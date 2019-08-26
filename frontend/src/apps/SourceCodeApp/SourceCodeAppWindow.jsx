import React, { Component } from 'react';
import FileTree from 'components/FileTree';
import Full from 'components/Full';
import SplitterLayout from 'components/SplitterLayout';
import Window from 'components/Desktop/Window';
import Editor from './subComponents/Editor';

export default class SourceCodeAppWindow extends Component {
  constructor(...args) {
    super(...args);

    this._editorLinkedState = null;
  }

  componentDidMount() {
    const { appRuntime } = this.props;
    const { editorLinkedState } = appRuntime;
    this._editorLinkedState = editorLinkedState;
  }

  _handleFileOpenRequest(path) {
    this._editorLinkedState.setState({
      lastFileOpenPath: path
    });
  }

  render() {
    const { appRuntime, ...propsRest } = this.props;
    const { editorLinkedState } = appRuntime;

    return (
      <Window
        {...propsRest}
        appRuntime={appRuntime}
      >
        <Full>
          <SplitterLayout>
            <Full>
              <FileTree onFileOpenRequest={path => this._handleFileOpenRequest(path)} />
            </Full>

            <Full>
              <Editor
                editorLinkedState={editorLinkedState}
              />
            </Full>
          </SplitterLayout>
        </Full>

      </Window>
    )
  }
}