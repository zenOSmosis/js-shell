

import React, { Component } from "react";
import Center from 'components/Center';

/**
 * Dynamically loads React components via code splitting.
 * 
 * @see https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
 *
 * Example usage:
 * const AsyncHome = createAsyncComponent(() => import("./containers/Home"));
 * 
 * @param { function } importComponent Refer to example usage
 * @return { React.Component } Returns a wrapper around the component which is
 * to be loaded
 */
export default function createAsyncComponent(importComponent, props = {}) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <Center>Loading...</Center>;
    }
  }

  return AsyncComponent;
};