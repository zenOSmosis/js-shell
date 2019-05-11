import React, {Component} from 'react';
import DesktopLinkedState, { hocConnect } from 'state/DesktopLinkedState'; 
import { withRouter } from 'react-router-dom';

let _isInstantiated = false;

/**
 * Handles browser URI redirection based on redirectLocation property.
 * 
 * Note: This should be treated as a singleton, having only one instance.
 */
class URIRedirector extends Component {
  _redirectLocation = null;

  constructor(props = {}) {
    if (_isInstantiated) {
      throw new Error('URIRedirector is already instantiated');
    }

    super(props);

    _isInstantiated = true;
  }

  componentDidUpdate() {
    const {redirectLocation} = this.props;
    if (redirectLocation && (redirectLocation !== this._redirectLocation)) {
      this.props.history.push(redirectLocation);
      this._redirectLocation = redirectLocation;
    }
  }

  render() {
    return (
      <div style={{display: 'none'}}></div>
    )
  }
}

/**
 * Binds URIRedirectory w/ DesktopLinkedState.
 */
export default withRouter(hocConnect(URIRedirector, DesktopLinkedState, (updatedState) => {
  const {redirectLocation} = updatedState;

  if (redirectLocation) {
    return {
      redirectLocation
    };
  }
}));

