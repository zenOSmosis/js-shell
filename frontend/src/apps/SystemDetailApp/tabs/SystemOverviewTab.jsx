import React, { Component } from 'react';
import getLogicalProcessors from 'utils/getLogicalProcessors';

class SystemOverview extends Component {
  render() {
    return (
      <div>
        Logical processors: { getLogicalProcessors() }
        <br />
        [ TODO: Use zenOSmosis logo ]
      </div>
    );
  }
}

export default SystemOverview;