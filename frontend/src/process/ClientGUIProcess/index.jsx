import React from 'react';
import ClientProcess, { EVT_PROCESS_UPDATE } from '../ClientProcess';

export default class ClientGUIProcess extends ClientProcess {
  _ReactComponent = null;

  setReactRenderer(Content) {
    return new Promise((resolve) => {
      // Using timeout to allow the process to kick to the next cycle
      // Otherwise it will not immediately render to any listeners
      // TODO: Replace w/ nextTick()
      setTimeout(() => {
        this._ReactComponent = (props = {}) => {

          if (typeof Content === 'object') {
            return (
              <div {...props}>
                {
                  Content
                }
              </div>
            );
          } else {
            return (
              <Content {...props} key={this.getPID()} />
            )
          }
        };

        this.emit(EVT_PROCESS_UPDATE);

        resolve();
      }, 0);
    });
  }

  getReactComponent() {
    return this._ReactComponent;
  }
}