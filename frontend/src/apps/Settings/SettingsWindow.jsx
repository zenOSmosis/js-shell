import React, { Component } from 'react';
import appConfig from './appConfig';
import Button from '../../components/Button';
import Center from '../../components/Center';
import Window from '../../components/Desktop/Window';
import Icon from '../../components/Icon';
import DesktopSettings from './subPanes/DesktopSettings';
import ContextMenuSettings from './subPanes/ContextMenuSettings';
import NotificationSettings from './subPanes/NotificationSettings';
import DesktopDrawer from './subPanes/DrawerSettings';
import LinkedStateMonitor from './subPanes/LinkedStateMonitor';
import HostConnection from './subPanes/HostConnection';
import DrawerSettings from './subPanes/DrawerSettings';

// TODO: Convert these to objects w/ attached views
const SUBVIEW_NAME_MAIN = 'Settings & Utilities';
const SUBVIEW_NAME_BACKGROUND_SETTINGS = 'Background Settings';
const SUBVIEW_NAME_CONTEXT_MENU_SETTINGS = 'Context Menu Settings';
const SUBVIEW_NAME_NOTIFICATION_SETTINGS = 'Notification Settings';
const SUBVIEW_NAME_DESKTOP_DRAWER = 'Desktop Drawer';
const SUBVIEW_NAME_LINKED_STATE_MONITOR = 'UI Linked States';
const SUBVIEW_NAME_HOST_CONNECTION = 'Host Connection';

class MainPane extends Component {
  componentDidMount() {
    // const { settingsWindow } = this.props;

    // settingsWindow.setSubToolbar();
  }

  render() {
    const { settingsWindow, subViews } = this.props;

    if (!settingsWindow) {
      throw new Error('settingsWindow is not passed as prop');
    }

    return (
      <Center style={{overflow: 'auto'}}>
        <div>
          <h1>NG</h1>

          {
            subViews.map((subView, idx) => {
              const {name} = subView;

              return (
                <div
                  key={idx}
                  style={{ width: 80, height: 80, display: 'inline-block' }}
                >
                  <Icon title={name} onClick={(evt) => settingsWindow.switchToSubViewNG(subView)} />
                </div>
              )
            })
          }

          {
            /*
          <h1>Desktop</h1>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Displays" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Windows" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Background" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_BACKGROUND_SETTINGS)} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Context Menu" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_CONTEXT_MENU_SETTINGS)} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Notifications" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_NOTIFICATION_SETTINGS)} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Drawer" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_DESKTOP_DRAWER)} />
          </div>
        </div>

        <div>
          <h1>Audio</h1>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Audio Devices" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Speech" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>
        </div>

        <div>
          <h1>System</h1>
          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Users &amp; Groups" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Storage" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Host Connection" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_HOST_CONNECTION)} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Processes" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="UI Linked States" onClick={(evt) => settingsWindow.switchToPane(SUBVIEW_NAME_LINKED_STATE_MONITOR)} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="UI Errors" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>

          <div style={{ width: 80, height: 80, display: 'inline-block' }}>
            <Icon title="Uptime" onClick={(evt) => settingsWindow.switchToPane('...')} />
          </div>
        </div>
            */
          }
        </div>
      </Center>
    );
  }
}

export default class SettingsWindow extends Component {
  state = {
    subToolbar: null,
    subPane: null
  };

  subViews = [
    {
      name: 'Background',
      component: <DesktopSettings settingsWindow={this} />
    },
    {
      name: 'Context Menu',
      component: <ContextMenuSettings settingsWindow={this} />
    },
    {
      name: 'Notifications',
      component: <NotificationSettings settingsWindow={this} />
    },
    {
      name: 'Drawer',
      component: <DrawerSettings settingsWindow={this} />
    },
    {
      name: 'Host Connection',
      component: <HostConnection settingsWindow={this} />
    },
    {
      name: 'Linked States',
      component: <LinkedStateMonitor settingsWindow={this} />
    }
  ];

  componentDidMount() {
    // this.switchToPane(SUBVIEW_NAME_MAIN);

    this.switchToSubViewNG();
  }

  setTitle(title) {
    this._desktopWindow.setTitle(title);
  }

  switchToSubViewNG(subPane = {}) {
    let {component} = subPane;
    if (!component) {
      component = <MainPane settingsWindow={this} subViews={this.subViews} />;
    }

    this.setState({
      subPane: component,
      subToolbar: null,
    }, () => {
      this.setTitle(subPane.name);
    });
  }

  setSubToolbar(subToolbar = null) {
    this.setState({
      subToolbar
    });
  }

  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        ref={c => this._desktopWindow = c}
        {...propsRest}
        appConfig={appConfig}
        toolbarRight={
          <Button onClick={ (evt) => this.switchToSubViewNG() } size="small">#</Button>
        }
        subToolbar={this.state.subToolbar}
      >
        {
          // TODO: Keep main settings in background and use transition to switch to subPane
        }

        {
          this.state.subPane
        }
      </Window>
    );
  }
}