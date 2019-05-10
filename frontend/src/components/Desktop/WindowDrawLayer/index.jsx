import React, {Component} from 'react';
import Center from 'components/Center';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Router, withRouter } from 'react-router';

/**
 * Render area for all desktop windows.
 */
class WindowDrawLayer extends Component {
  componentDidMount() {
    console.warn('TODO: Implement DOM router integration w/ windows');
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.debug('ROUTE CHANGED', this.props.location);
  }

  render() {
    let {launchedAppConfigs} = this.props;
    if (!launchedAppConfigs) {
      launchedAppConfigs = [];
    }

    return (
      <Center>
        {
          launchedAppConfigs.map((appConfig, idx) => {           
            return (
              <div style={{position: 'absolute'}} key={idx}>
                {
                  appConfig.getMainWindow()
                }
              </div>
            );
          })
        }
      </Center>
    )
  }
}

// @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
export default withRouter(hocConnect(WindowDrawLayer, DesktopLinkedState, (updatedState) => {
  const {launchedAppConfigs} = updatedState;

  if (launchedAppConfigs) {
    return {
      launchedAppConfigs
    };
  }
}));