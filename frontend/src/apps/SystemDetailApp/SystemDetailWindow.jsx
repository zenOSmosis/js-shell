import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import { Button, ButtonGroup } from 'components/ButtonGroup';
import { Layout, Content, Footer } from 'components/Layout';
import Scrollable from 'components/Scrollable';

// TODO: Rename these with "Tab" suffix
import SystemOverviewTab from './tabs/SystemOverviewTab';
import EnvironmentTab from './tabs/EnvironmentTab';
import ProcessesTab from './tabs/ProcessesTab';

import SystemDetailFooter from './SystemDetailFooter';

const TAB_SYSTEM_OVERVIEW = 'system-overview';
const TAB_PROCESSES = 'processes';
const TAB_ENVIRONMENT = 'environment';

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
                      return <SystemOverviewTab />;

                    case TAB_PROCESSES:
                      return <ProcessesTab />;

                    case TAB_ENVIRONMENT:
                      return <EnvironmentTab />;

                    default:
                      return null;
                  }
                })()
              }
            </Scrollable>
          </Content>
          <Footer>
            <SystemDetailFooter />
          </Footer>
        </Layout>
      </Window>
    );
  }
}