import React, {Component} from 'react';
import {MasterLinkedStateListener, EVT_LINKED_STATE_UPDATE} from '../../../../state/LinkedState';
import Button from '../../../../components/Button';
import {Row, Column} from '../../../../components/RowColumn';
// import fetchStackTrace from 'stacktrace-js';
import {Tree} from 'antd';
import JSONEditor from '../../../../components/JSONEditor';
import {Select, Option} from '../../../../components/Select';
import safeStringify from 'fast-safe-stringify';
const {TreeNode} = Tree;

export default class LinkedStateMonitor extends Component {
  state = {
    linkedStateInstances: [],
    linkedStateUpdates: []
  };

  handleUpdatedLinkedState = (data) => {
    // console.debug('updated state', data);
    const {linkedStateUpdates} = this.state;

    // Add state data to beginning of array
    linkedStateUpdates.unshift(data);

    this.setState({linkedStateUpdates});

    // console.debug(data);
  }

  componentDidMount() {
    this._masterLinkedStateListener = new MasterLinkedStateListener();

    this.getLinkedStateInstances();
    this._masterLinkedStateListener.on(EVT_LINKED_STATE_UPDATE, this.handleUpdatedLinkedState);
  }

  componentWillUnmount() {
    this._masterLinkedStateListener.off(EVT_LINKED_STATE_UPDATE, this.handleUpdatedLinkedState);

    this._masterLinkedStateListener = null;
  }

  getLinkedStateInstances() {
    const linkedStateInstances = this._masterLinkedStateListener.getLinkedStateInstances();

    this.setState({linkedStateInstances}, () => {
      console.debug('linked state instances', linkedStateInstances);
    });

    return linkedStateInstances;
  }

  async fetchUpdateStackTrace(linkedStateUpdate) {
    /*
    try {
      
    } catch (exc) {
      console.warn('...');
    }
    */

    console.debug('... fetch stack trace', linkedStateUpdate);

    // const parsed = await fetchStackTrace.fromError(linkedStateUpdate.updatedState._rawCallStack);

    // console.debug('parsed stack trace', parsed);

    // return parsed;
  }

  render() {
    return (
      <div style={{textAlign: 'left', overflow: 'auto', width: '100%', height: '100%'}}>
        <ul>
          <li>In / Out</li>
          <li>Monitor linked states as they happen</li>
          <li>Is it possible to obtain the caller?</li>
          <li>Event counts</li>
        </ul>

        <label>Enable Stack Tracing</label>
      
        <Button onClick={ evt => console.debug(this._masterLinkedStateListener.getLinkedStateInstances()) }>Fetch linked state instances</Button>
      
        <LinkedStateGroups masterLinkedStateListener={this._masterLinkedStateListener} linkedStateInstances={this.state.linkedStateInstances} />

        <hr />

        {
          /*
          this.state.linkedStateInstances.map((linkedStateInstance, idx) => {
            // console.debug('linked state instance', linkedStateInstance);

            const {constructor} = linkedStateInstance;
            const {name: className} = constructor;

            return (
              <div key={idx} onClick={ (evt) => console.debug(linkedStateInstance) }>
                {className}
                |
                Ref count: {this._masterLinkedStateListener.getLinkedStateReferenceCount(linkedStateInstance)}
                |
                Original instance?: {linkedStateInstance.getIsOriginalInstance() ? 'Yes' : 'No'} 
                |
                Create date: {linkedStateInstance.getCreateDate().toString()}
                <hr />
              </div>
            );
          })
          */
        }

        {
          this.state.linkedStateUpdates.map((linkedStateUpdate, idx) => {
            return (
              <div key={idx} onClick={ (evt) => this.fetchUpdateStackTrace(linkedStateUpdate) }>
                {
                  linkedStateUpdate.linkedState._linkedScopeName
                }

                {
                  JSON.stringify(linkedStateUpdate.updatedState)
                }
                
                <hr />
              </div>
            );
          })
        }
      </div>
    );
  }
}

// TODO: ?
const getUniqueLinkedStateInstances = (linkedStateInstances) => {
  let classNames = [];
  let instances = [];

  linkedStateInstances.forEach((instance) => {
    const testClassName = instance.getClassName();

    if (!classNames.includes(testClassName)) {
      classNames.push(testClassName);

      instances.push(instance);
    }
  });

  return instances;
};

const LinkedStateGroups = (props = {}) => {
  const {masterLinkedStateListener, linkedStateInstances} = props;

  const uniqueInstances = getUniqueLinkedStateInstances(linkedStateInstances);

  return (
    <div>
        <Select defaultValue="">
          <Option value="">Select a LinkedState instance</Option>
          {
            uniqueInstances.map((instance, idx) => {
              return (
                <Option key={idx} value={instance.getUUID()}>{
                  instance.getClassName()
                }</Option>
              )
            })
          }
        </Select>
        {
          uniqueInstances.map((instance, idx) => {
            const safeValue = JSON.parse(safeStringify(instance));

            console.debug('l instance', instance);
            return (
              <div key={idx}>
                {
                  instance.getClassName()
                }

                <div style={{height: 500}}>
                  <JSONEditor value={safeValue} />
                </div>
              </div>
            );
          })
        }
    </div>
  );
}