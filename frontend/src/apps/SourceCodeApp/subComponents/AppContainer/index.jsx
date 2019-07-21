import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import JSONEditor from 'components/JSONEditor';

export default class AppContainer extends Component {
  componentDidMount() {
    console.warn('TODO: Implement babel standalone load');

    this.eval();
  }

  componentDidUpdate(prevProps) {
    console.debug('........');

    const {rawCode} = this.props;

    if (rawCode !== prevProps.rawCode) {
      this.eval();
    }
  }

  eval() {
    const {rawCode, app} = this.props;

    /*
    app.console = {
      log: (msg = null) => {
        console.log(msg);

        app.setView(<JSONEditor value={msg} />);
      }
    };
    */

    /*
    * const setTitle = (...args) => { this.setTitle(...args) };
        const setView = (...args) => { this.setView(...args) };

        const console = this.console;
        const render = (content) => {
          if (typeof content === 'string' || typeof content === 'number') {
            this.setView(content);
          } else {
            this.console.log(content);
          }
        }

        // End bootstrap
    */

    app.page = page;

    const evalInContext = () => {
      console.warn('TODO: Create container app to run this in. Load babel dynamically');
      
      eval(`
        (async () => {
          try {
            const resp = await (async () => {
              try {
                ${rawCode}
              } catch (exc) {
                throw exc;
              }
            })();
  
            if (resp) {
              render(resp);
            }
          } catch (exc) {
            throw exc;
          }
        })();
      `);
    }

    evalInContext.call(app);
  }

  render() {
    const {app, rawCode} = this.props;

    return (
      <Window
        app={app}
      >
        AppContainer
      </Window>
    );
  }
}