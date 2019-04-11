import React, { Component } from 'react';
import appConfig from './appConfig';
import Button from '../../components/Button';
import Window from '../../components/Desktop/Window';
import Icon from '../../components/Icon';
import DesktopSettings from './subPanes/DesktopSettings';
import ContextMenuSettings from './subPanes/ContextMenuSettings';
import NotificationSettings from './subPanes/NotificationSettings';
import DesktopDrawer from './subPanes/DrawerSettings';
import Center from '../../components/Center';

// TODO: Convert these to objects w/ attached views
const SUBVIEW_NAME_MAIN = 'Settings & Utilities';
const SUBVIEW_NAME_BACKGROUND_SETTINGS = 'Background Settings';
const SUBVIEW_NAME_CONTEXT_MENU_SETTINGS = 'Context Menu Settings';
const SUBVIEW_NAME_NOTIFICATION_SETTINGS = 'Notification Settings';
const SUBVIEW_NAME_DESKTOP_DRAWER = 'Desktop Drawer';

class MainPane extends Component {
  render() {
    const { settingsWindow } = this.props;

    return (
      <Center>
        <div>
          <h1>Desktop</h1>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Displays" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Windows" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Background" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_BACKGROUND_SETTINGS)} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Context Menu" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_CONTEXT_MENU_SETTINGS)} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Notifications" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_NOTIFICATION_SETTINGS)} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Drawer" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_DESKTOP_DRAWER)} />
          </div>
        </div>

        <div>
          <h1>Audio</h1>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Audio Devices" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Speech" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>
        </div>

        <div>
          <h1>System</h1>
          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Users &amp; Groups" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Storage" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Remote Hosts" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Processes" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 60, height: 60, display: 'inline-block' }}>
            <Icon title="Uptime" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>
        </div>
      </Center>
    );
  }
}

export default class SettingsWindow extends Component {
  state = {
    subPane: null
  };

  componentDidMount() {
    this.switchToPane(SUBVIEW_NAME_MAIN);
  }

  setTitle(title) {
    this._desktopWindow.setTitle(title);
  }

  switchToPane(subPane) {
    switch (subPane) {
      case SUBVIEW_NAME_MAIN:
        this.setState({
          subPane:
            <MainPane
              settingsWindow={this}
            />
        }, () => {
          // TODO: Use default title
          this.setTitle(SUBVIEW_NAME_MAIN);
        });
        break;

      case SUBVIEW_NAME_BACKGROUND_SETTINGS:
        this.setState({
          subPane:
            <DesktopSettings
              settingsWindow={this}
            />
        }, () => {
          this.setTitle(SUBVIEW_NAME_BACKGROUND_SETTINGS);
        });
        break;

      case SUBVIEW_NAME_CONTEXT_MENU_SETTINGS:
        this.setState({
          subPane:
            <ContextMenuSettings
              settingsWindow={this}
            />
        }, () => {
          this.setTitle(SUBVIEW_NAME_CONTEXT_MENU_SETTINGS);
        });
        break;

      case SUBVIEW_NAME_NOTIFICATION_SETTINGS:
        this.setState({
          subPane:
            <NotificationSettings
              settingsWindow={this}
            />
        }, () => {
          this.setTitle(SUBVIEW_NAME_NOTIFICATION_SETTINGS);
        });
        break;
      
      case SUBVIEW_NAME_DESKTOP_DRAWER:
        this.setState({
          subPane:
            <DesktopDrawer
              settingsWindow={this}
            />
        }, () => {
          this.setTitle(SUBVIEW_NAME_DESKTOP_DRAWER);
        });
        break;

      default:
        console.warn(`Invalid subview name: ${subPane}`)
        break;
    }
  }

  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        ref={c => this._desktopWindow = c}
        {...propsRest}
        appConfig={appConfig}
        toolbarRight={
          <Button onClick={ (evt) => this.switchToPane(SUBVIEW_NAME_MAIN) } size="small">#</Button>
        }
      >
        {
          this.state.subPane
        }
      </Window>
    );
  }
}