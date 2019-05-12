import React, {Component} from 'react';
import Full from 'components/Full';
import { Layout, Header, Content, Aside } from 'components/Layout';
import { Button } from 'components/Button';
import { Icon as AntdIcon } from 'antd';
import SplitEditorHorizontalIcon from 'icons/vscode/split-editor-horizontal-inverse.svg';
import SplitEditorVerticalIcon from 'icons/vscode/split-editor-vertical-inverse.svg';
// TODO: Remove; prototyping
import MonacoEditor from 'components/MonacoEditor';

export default class TabbedPane extends Component {
  render() {
    const {/*hasOrientationControls,*/ splitEditor} = this.props;

    return (
      <Full>
        <Layout>
          <Header style={{height: 25, textAlign: 'left', backgroundColor: 'rgba(0,0,0,.4)'}}>
            <Layout>
              <Content>
                <Button
                  style={{border: 0, padding: 0, borderRadius: 0}}
                >
                  <AntdIcon type="file-text" />File
                </Button>
              </Content>
              {
                // hasOrientationControls &&
                <Aside width={40} style={{overflow: 'hidden'}}>
                  { /* Horizontal split */ }
                  <button
                    onClick={ (evt) => splitEditor.split('horizontal') }
                    style={{
                      border: 0,
                      padding: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <img
                      src={SplitEditorHorizontalIcon}
                      style={{width: '1rem', height: '1rem'}}
                    />
                  </button>

                  { /* Vertical Split */ }
                  <button 
                    onClick={ (evt) => splitEditor.split('vertical') }
                    style={{
                      border: 0,
                      padding: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: 'transparent'
                    }
                  }>
                    <img src={SplitEditorVerticalIcon} style={{width: '1rem', height: '1rem'}} />
                  </button>
                </Aside>
              }
            </Layout>
          </Header>
          <Layout>
            <Content>
              <MonacoEditor key="monaco-1" />
            </Content>
          </Layout>
        </Layout>
      </Full>
    );
  }
}