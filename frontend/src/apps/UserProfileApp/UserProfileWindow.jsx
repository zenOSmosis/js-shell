import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Scrollable from 'components/Scrollable';
import Section from 'components/Section';
import { Content, Layout } from 'components/Layout';
import { Avatar } from 'antd';
import { getLocalUser, EVT_SHARED_UPDATE } from 'utils/p2p/Peer.class';

export default class UserProfileWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      aboutDescription: ''
    };

    this._localUser = getLocalUser();

    this._nicknameInput = null;
    this._aboutDescriptionInput = null;
    
    this._handleLocalUserUpdate = this._handleLocalUserUpdate.bind(this);
  }

  componentDidMount() {
    this._localUser.on(EVT_SHARED_UPDATE, this._handleLocalUserUpdate);

    // Perform initial sync
    this._handleLocalUserUpdate();
  }

  componentWillUnmount() {
    this._localUser.off(EVT_SHARED_UPDATE, this._handleLocalUserUpdate);
  }

  /**
   * Internally called once the localUser updates.
   */
  _handleLocalUserUpdate() {
    const nickname = this._localUser.getNickname() || '';
    const aboutDescription = this._localUser.getAboutDescription() || '';

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

    this._localUser.setNickname(nickname);
    this._localUser.setAboutDescription(aboutDescription);
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
                  // onChange={ evt => this._localUser.setNickname(evt.target.value) }
                  />
                </Section>

                <Section>
                  <textarea
                    placeholder="About Me"
                    ref={c => this._aboutDescriptionInput = c}
                    value={aboutDescription}
                    onChange={evt => this._handleAboutDescriptionInput(evt)}
                  // onChange={ evt => this._localUser.setAboutDescription(evt.target.value) }
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