import React, { Component } from 'react';
import appRegistration from './appRegistration';
import Window from 'components/Desktop/Window';
import { Button, ButtonGroup } from 'components/ButtonGroup';
import { Layout, Content, Footer } from 'components/Layout';
import Scrollable from 'components/Scrollable';
import Environment from './subPanes/Environment';
import Processes from './subPanes/Processes';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import hocConnect from 'state/hocConnect';

const TAB_SYSTEM_OVERVIEW = 'system-overview';
const TAB_PROCESSES = 'processes';
const TAB_ENVIRONMENT = 'environment';

const ClientPressure = (props = {}) => {
  return (
    <span>{props.percent} %</span>
  );
}

const ConnectedClientPressure = hocConnect(ClientPressure, CPUTimeLinkedState, (updatedState) => {
  const { cpusLevels } = updatedState;

  if (cpusLevels && cpusLevels[0]) {
    return {
      percent: cpusLevels[0]
    }
  }
});

export default class SystemDetailWindow extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activeTab: TAB_SYSTEM_OVERVIEW
    };
  }

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
        appRegistration={appRegistration}
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
        <Layout>
          <Content>
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
          </Content>
          <Footer>
            Main Thread CPU Usage: <ConnectedClientPressure />
          </Footer>
        </Layout>
      </Window>
    );
  }
}