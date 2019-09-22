import React, {Component} from 'react';
import app from './app';
import Window from 'components/Desktop/Window';
import ClientProcess from 'process/ClientProcess';
import Center from 'components/Center';

export default class ProcessTesterWindow extends Component {
  testClientProcess() {
    try {
      new ClientProcess(false, (proc) => {
        // Expect this and proc to be the same 
        console.warn({
          TODO: 'Expect this and proc to be the same',
          instance: this,
          proc: proc
        });

        /*

        const proc_pid = proc.getPid();
        const this_pid = this.getPid();
      
        if (proc_pid === this_pid) {
          console.debug('PIDs match!', this);
        } else {
          throw new Error('this is not executing in process scope!');
        }
      
        const self_setImmediate = setImmediate.toString();
        const proc_setImmediate = proc.setImmediate.toString();
        const this_setImmediate = this.setImmediate.toString();
      
        if (self_setImmediate === proc_setImmediate &&
            self_setImmediate === this_setImmediate) {
          console.debug('setImmediate is properly routed');
        } else {
          throw new Error('setImmediate is not properly routed');
        }

        */
      }); 
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const {...propsRest} = this.props;
    return (
      <Window
        {...propsRest}
        app={app}
      >
        <Center>
          <button onClick={ evt => this.testClientProcess() }>Run ClientProcess Tests</button>
        </Center>
      </Window>
    );
  }
}