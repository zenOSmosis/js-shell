import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Scrollable from 'components/Scrollable';
import Section from 'components/Section';
import { Content, Layout } from 'components/Layout';
import { Avatar } from 'antd';
import { getLocalPeer, EVT_SHARED_UPDATE } from 'utils/p2p/Peer.class';

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
    
    this._handleLocalPeerUpdate = this._handleLocalPeerUpdate.bind(this);
  }

  componentDidMount() {
    this._localPeer.on(EVT_SHARED_UPDATE, this._handleLocalPeerUpdate);

    // Perform initial sync
    this._handleLocalPeerUpdate();
  }

  componentWillUnmount() {
    this._localPeer.off(EVT_SHARED_UPDATE, this._handleLocalPeerUpdate);
  }

  /**
   * Internally called once the localPeer updates.
   */
  _handleLocalPeerUpdate() {
    const nickname = this._localPeer.getNickname() || '';
    const aboutDescription = this._localPeer.getAboutDescription() || '';

    this.setState({
      nickname,
      aboutDescription
    }); 
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

  _handleSave() {
    const { nickname, aboutDescription } = this.state;

    this._localPeer.setNickname(nickname);
    this._localPeer.setAboutDescription(aboutDescription);
  }

  render() {
    const { ...propsRest } = this.props;

    const { nickname, aboutDescription } = this.state;

    return (
      <Window
        {...propsRest}
        toolbarRight={
          <button onClick={evt => this._handleSave() }>
            Save
          </button>
        }
      >
        <Layout>
          <Content>
            <Scrollable>
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
            </Scrollable>
          </Content>
        </Layout>
      </Window>
    );
  }
}