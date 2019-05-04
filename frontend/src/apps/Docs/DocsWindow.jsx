import React, {Component} from 'react';
import appConfig from './appConfig';
import Window from 'components/Desktop/Window';
import IFrame from 'components/IFrame';
import {Layout, Header, Content, Footer} from 'components/Layout';
import {ButtonGroup, Button} from 'components/ButtonGroup';

export default class DocsWindow extends Component {
  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        appConfig={appConfig}
      >
        <Layout>
          <Header style={{padding: 0, margin: 0, minHeight: 0, height: 0, overflow: 'visible'}}>
            <ButtonGroup>
              <Button>UI Storybook</Button>
              <Button>Server Docs</Button>
            </ButtonGroup>
          </Header>
          <Content>
             <IFrame src="https://storybook.js.org/docs/basics/introduction/" />
          </Content>
        </Layout>
        
      </Window>
    );
  }
}