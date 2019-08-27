import React, { Component } from 'react';
import { Layout, Header, Content } from 'components/Layout';
import Editor from './Editor';
import FileTabs from './FileTabs';

class EditorWithFileTabs extends Component {
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
          <Editor
            editorLinkedState={editorLinkedState}
          />
        </Content>
      </Layout>
    );
  }
}

export default EditorWithFileTabs;