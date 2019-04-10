import React, {Component} from 'react';
import Window, {WindowLifecycleEvents, getWindowStack, EVT_WINDOW_CREATED, EVT_WINDOW_WILL_MINIMIZE, EVT_WINDOW_DID_CLOSE} from '../../Window';
import {Button, ButtonGroup} from '../../../ButtonGroup';

export default class WindowManager extends Component {
  state = {
    windowStack: []
  }

  constructor(props) {
    super(props);

    this._windowLifecycleEvents = new WindowLifecycleEvents();


    this._windowLifecycleEvents.on(EVT_WINDOW_CREATED, (window) => {
      this.getWindowStack();

      console.debug('window', window, getWindowStack());
    });
    this._windowLifecycleEvents.on(EVT_WINDOW_DID_CLOSE, (window) => {
      this.getWindowStack();
    });
    this._windowLifecycleEvents.on(EVT_WINDOW_WILL_MINIMIZE, (window) => {
      console.debug('WINDOW!', window);
    });
  }

  /**
   * Retrieves the window stack and sets local state.
   */
  getWindowStack() {
    const windowStack = getWindowStack();

    this.setState({
      windowStack
    });
  }

  componentDidMount() {
    this.getWindowStack();
  }

  closeWindow(window) {
    window.close();
  }

  render() {
    const {...propsRest} = this.props;
    const {windowStack} = this.state;

    return (
      <Window
        {...propsRest}
        title="Window Manager"
        description="Manages open windows"
      >
        {
          windowStack.map((window, idx) => {
            console.debug('to render', window);
            
            return (
              <div key={idx}>
                <div>
                  <ButtonGroup>
                    <Button onClick={ (evt) => this.closeWindow(window) }>Close</Button>
                    <Button
                      onClick={ (evt) => window.minimize() }
                    >Minimize</Button>
                    <Button>Maximize</Button>
                    <Button>Bring to Front</Button>
                  </ButtonGroup>
                </div>

                <div>
                  {window.state.title} {JSON.stringify(window.getUptime())}
                  {
                    // TODO: Include clock for window uptime
                  }
                </div>
                
                {
                  idx < windowStack.length &&
                  <hr />
                }
              </div>
            )
          })
        }
      </Window>
    );
  }
}