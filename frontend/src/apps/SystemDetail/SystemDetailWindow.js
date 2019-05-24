import React, { Component } from 'react';
import app from './app';
import Window from 'components/Desktop/Window';
import { Button, ButtonGroup } from 'components/ButtonGroup';
import Scrollable from 'components/Scrollable';
import Environment from './subPanes/Environment';
import Processes from './subPanes/Processes';

const TAB_SYSTEM_OVERVIEW = 'system-overview';
const TAB_PROCESSES = 'processes';
const TAB_ENVIRONMENT = 'environment';

export default class SystemDetailWindow extends Component {
  state = {
    activeTab: TAB_SYSTEM_OVERVIEW
  };

  switchToTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const { activeTab } = this.state;

    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
        app={app}
        toolbar={
          <ButtonGroup style={{ whiteSpace: 'nowrap' }}>
            <Button
              active={activeTab === TAB_SYSTEM_OVERVIEW}
              onClick={evt => this.switchToTab(TAB_SYSTEM_OVERVIEW)}
            >
              System Overview
            </Button>
            <Button
              active={activeTab === TAB_PROCESSES}
              onClick={evt => this.switchToTab(TAB_PROCESSES)}
            >
              Processes
            </Button>
            <Button
              active={activeTab === TAB_ENVIRONMENT}
              onClick={evt => this.switchToTab(TAB_ENVIRONMENT)}
            >
              Environment
            </Button>
          </ButtonGroup>
        }
      >
        <Scrollable>
          {
            (() => {
              switch (activeTab) {
                case TAB_SYSTEM_OVERVIEW:
                  return 'System Overview';
                
                case TAB_PROCESSES:
                  return <Processes />;

                case TAB_ENVIRONMENT:
                  return <Environment />;
                
                default:
                  return null;
              }
            })()
          }
        </Scrollable>
      </Window>
    );
  }
}