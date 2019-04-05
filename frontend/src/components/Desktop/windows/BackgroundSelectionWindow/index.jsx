import React, { Component } from 'react';
import Window from '../../Window';
import Carousel3D from '../../../Carousel3D';
import { ButtonGroup, Button } from '../../../ButtonGroup';

// import { Layout } from 'antd';
// const { Header, Sider, Content, Footer } = Layout;
import {Layout, Header, Sider, Content, Footer} from '../../../Layout';

const SUBVIEW_BACKGROUND_SELECTION = (
  <Layout>
    <Content>
      <Carousel3D key="carousel3d" />
    </Content>

    <Footer style={{textAlign: 'left'}}>
      Current background: xxx
    </Footer>
  </Layout>
);

const SUBVIEW_DRAW_LAYOUT = (
  <div>
    Draw Layout
  </div>
);

export default class BackgroundSelectionWindow extends Component {
  state = {
    subview: SUBVIEW_BACKGROUND_SELECTION
  };

  setSubview(subview) {
    this.setState({
      subview
    });
  }

  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
        title="Desktop"
      >
        <Layout>
          <Header>
            <ButtonGroup size="small">
              <Button onClick={evt => this.setSubview(SUBVIEW_BACKGROUND_SELECTION)}>Background</Button>
              <Button onClick={evt => this.setSubview(SUBVIEW_DRAW_LAYOUT)}>Draw Layout</Button>
            </ButtonGroup>
          </Header>

          <Content>
            {
              this.state.subview
            }
          </Content>

        </Layout>
      </Window>
    );
  }
}