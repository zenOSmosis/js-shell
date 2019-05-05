// Here for reference only...

/*
import React, { Component } from 'react';
import Carousel3D from '../../../components/Carousel3D';
import { ButtonGroup, Button } from '../../../components/ButtonGroup';

// import { Layout } from 'antd';
// const { Header, Sider, Content, Footer } = Layout;
import { Layout, Header, Sider, Content, Footer } from '../../../components/Layout';

// TODO: Allow CSS3 pattern background

const SUBVIEW_BACKGROUND_SELECTION = (
  <Layout>
    <Content>
      <Carousel3D key="carousel3d" />
    </Content>

    <Footer style={{ textAlign: 'left' }}>
      Current background: xxx
    </Footer>
  </Layout>
);

const SUBVIEW_OPTIONS = (
  <div>
    multimedia...
  </div>
);

export default class DesktopSettings extends Component {
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
      <Layout>
        <Content>
          <h1>Background Type</h1>
          <ButtonGroup size="small">
            <Button onClick={evt => this.setSubview(SUBVIEW_BACKGROUND_SELECTION)}>Wallpapers</Button>
            <Button onClick={evt => this.setSubview(SUBVIEW_OPTIONS)}>Multimedia</Button>
          </ButtonGroup>
          {
            this.state.subview
          }
        </Content>

        <Footer>

        </Footer>

      </Layout>
    );
  }
}
*/