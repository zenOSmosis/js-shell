import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import ReactPlayer from 'react-player'
import { Row, Column } from 'components/RowColumn';
import { Layout, /* Sider, */ Content, Footer } from 'components/Layout';

export default class HelloWorldWindow extends Component {
  render() {
    const { ...propsRest } = this.props;
    const cmdArguments = this.props.app.getCmdArguments();
    console.log('cmdArguments',cmdArguments)
    return (
      <Window
        {...propsRest}
      >
        <Layout>
          <Layout>
            <Content>
              <ReactPlayer url={cmdArguments} playing />
            </Content>
          </Layout>

          <Footer className="Footer" style={{ textAlign: 'left' }}>
            {cmdArguments}
          </Footer>
        </Layout>
      </Window>
    );
  }
}