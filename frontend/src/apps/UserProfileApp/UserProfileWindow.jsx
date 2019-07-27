import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Section from 'components/Section';
import { Content, Layout, Footer } from 'components/Layout';
import { Avatar } from 'antd';

export default class HelloWorldWindow extends Component {
  render() {
    const { ...propsRest } = this.props;

    return (
      <Window
        {...propsRest}
      >
        <Layout>
          <Content>
            <Section>
              Setting a user profile is optional, and makes it easier for people to find you.
            </Section>

            <Avatar size={128} icon="user" />

            <div>
              <Section>
                <input type="text" placeholder="Nickname" />
              </Section>

              <Section>
                <textarea placeholder="About Me"></textarea>
              </Section>

              <Section>
                ...<br />
                ...<br />
                ...<br />
                ...<br />
                ...<br />
                ...<br />
              </Section>
            </div>
          </Content>
          <Footer style={{ overflow: 'auto' }}>
            <div style={{ float: 'right' }}>
              <button>Open P2P Connections</button>
            </div>
          </Footer>
        </Layout>
      </Window>
    );
  }
}