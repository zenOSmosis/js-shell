import React, {Component} from 'react';
import LinkedState, {EVT_LINKED_STATE_UPDATE} from './LinkedState';

/**
 * Connects LinkedState to a React component's lifecycle.
 * 
 * This function takes a component...
 * @see https://reactjs.org/docs/higher-order-components.html
 * 
 * @param {*} WrappedComponent 
 * @param {*} LinkedStateExtension 
 */
const hocConnect = (WrappedComponent, LinkedStateExtension) => {
  // ...and returns another component...
  return class extends Component {
    constructor(props) {
      super(props);

      if (LinkedStateExtension.prototype) {
        this._linkedStateInstance = new LinkedStateExtension();
      } else {
        this._linkedStateInstance = LinkedStateExtension;
      }

      if (!this._linkedStateInstance) {
        throw new Error('No LinkedStateExtension present');
      }

      this.state = this._linkedStateInstance.getState();
      
      /*
      this.state = {
        data: selectData(DataSource, props)
      };
      */
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      // DataSource.addChangeListener(this.handleChange);

      this._linkedStateInstance.on(EVT_LINKED_STATE_UPDATE, this.handleUpdatedState);
    }

    componentWillUnmount() {
      this._linkedStateInstance.off(EVT_LINKED_STATE_UPDATE, this.handleUpdatedState);
      
      this._linkedStateInstance.destroy();
    }

    handleUpdatedState = (updatedState) => {
      console.debug('Handling updated state', updatedState, WrappedComponent);

      this.setState(updatedState);
    }

    render() {
      const passedProps = Object.assign({}, this.props, this.state);

      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent
        // data={this.state.data}
        {...passedProps}
      />;
    }
  };
};

export default hocConnect;