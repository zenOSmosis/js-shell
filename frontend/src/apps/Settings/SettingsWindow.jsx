import React, { Component } from 'react';
import app from './app';
import Button from 'components/Button';
import Center from 'components/Center';
import Full from 'components/Full';
import Window from 'components/Desktop/Window';
import Icon from 'components/Icon';
import {Grid, GridItem} from 'components/Grid';
import ConnectedClients from './subPanes/ConnectedClients';
import DesktopBackground from './subPanes/DesktopBackground';
import ContextMenuSettings from './subPanes/ContextMenuSettings';
import NotificationSettings from './subPanes/NotificationSettings';
// import DesktopDrawer from './subPanes/DrawerSettings';
import LinkedStateMonitor from './subPanes/LinkedStateMonitor';
import HostConnection from './subPanes/HostConnection';
import DrawerSettings from './subPanes/DrawerSettings';

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
        <Grid>
          {
            subViews.map((subView, idx) => {
              const {title} = subView;

              return (
                <GridItem
                  key={idx}
                  style={{ width: 100, height: 100 }}
                >
                  <Icon title={title} onClick={(evt) => settingsWindow.switchToSubViewNG(subView)} />
                </GridItem>
              )
            })
          }
        </Grid>
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
      title: 'Background',
      component: <DesktopBackground settingsWindow={this} />
    },
    {
      title: 'Context Menu',
      component: <ContextMenuSettings settingsWindow={this} />
    },
    {
      title: 'Notifications',
      component: <NotificationSettings settingsWindow={this} />
    },
    {
      title: 'Drawer',
      component: <DrawerSettings settingsWindow={this} />
    },
    {
      title: 'Host Connection',
      component: <HostConnection settingsWindow={this} />
    },
    {
      title: 'Linked States',
      component: <LinkedStateMonitor settingsWindow={this} />
    },
    {
      title: 'Connected Clients',
      component: <ConnectedClients settingsWindow={this} />
    }
  ];

  componentDidMount() {
    // this.switchToPane(SUBVIEW_NAME_MAIN);

    this.switchToSubViewNG();
  }

  setTitle(title) {
    app.setTitle(title);
  }

  switchToSubViewNG(subPane = {}) {
    let {component, title: subPaneTitle} = subPane;
    
    const title = (subPaneTitle ? subPaneTitle : app.getDefaultTitle());

    if (!component) {
      component = <MainPane settingsWindow={this} subViews={this.subViews} />;
    }

    this.setState({
      subPane: component,
      subToolbar: null,
    }, () => {
      this.setTitle(title);
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
        app={app}
        toolbarRight={
          <Button onClick={ (evt) => this.switchToSubViewNG() } size="small">#</Button>
        }
        subToolbar={this.state.subToolbar}
      >
        {
          // TODO: Keep main settings in background and use transition to switch to subPane
        }

        <Full idx={this.subViews.indexOf(this.state.subPane)}>
          {
            this.state.subPane
          }
        </Full>
      </Window>
    );
  }
}