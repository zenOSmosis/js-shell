import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Section from 'components/Section';
import { Content, Layout, /* Footer */ } from 'components/Layout';
import { Avatar } from 'antd';
import getLocalPeer from 'utils/p2p/getLocalPeer';

export default class UserProfileWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      aboutDescription: ''
    };

    this._localPeer = getLocalPeer();

    this._nicknameInput = null;
    this._aboutDescriptionInput = null;
  }

  _handleNicknameInput(evt) {
    const { value } = evt.target;

    this.setState({
      nickname: value
    });
  }

  _handleAboutDescriptionInput(evt) {
    const { value } = evt.target;

    this.setState({
      aboutDescription: value
    });
  }

  render() {
    const { ...propsRest } = this.props;

    const { nickname, aboutDescription } = this.state;

    return (
      <Window
        {...propsRest}
      >
        <Layout>
          <Content>
            <Section>
              Setting a user profile is optional, and makes it easier for people to find you.
            </Section>

            <div>
              <Avatar size={128} icon="user" />
              <button style={{ margin: 10 }}>
                Upload Photo
              </button>
            </div>

            <div>
              <Section>
                <input
                  type="text"
                  placeholder="Nickname"
                  ref={c => this._nicknameInput = c}
                  value={nickname}
                  onChange={evt => this._handleNicknameInput(evt)}
                // onChange={ evt => this._localPeer.setNickname(evt.target.value) }
                />
              </Section>

              <Section>
                <textarea
                  placeholder="About Me"
                  ref={c => this._aboutDescriptionInput = c}
                  value={aboutDescription}
                  onChange={evt => this._handleAboutDescriptionInput(evt)}
                // onChange={ evt => this._localPeer.setAboutDescription(evt.target.value) }
                ></textarea>
              </Section>
            </div>
          </Content>
          {
            /*
            <Footer style={{ overflow: 'auto' }}>
              <div style={{float: 'left'}}>
                <button>
                  Randomize
                </button>
              </div>
              
              <div style={{ float: 'right' }}>
                <button>Open P2P Connections</button>
              </div>
            </Footer>
            */
          }
        </Layout>
      </Window>
    );
  }
}