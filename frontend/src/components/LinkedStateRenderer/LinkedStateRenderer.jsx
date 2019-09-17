import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hocConnect from 'state/hocConnect';

/**
 * Wraps LinkedState's hocConnect with all-in-one ability to render without
 * having to connect a separate view.
 * 
 * @extends React.Component
 */
class LinkedStateRenderer extends Component {
  static propTypes = {
    linkedState: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ]).isRequired,
    onUpdate: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired
  };

  state = {
    RenderableLinkedState: null
  };

  componentDidMount() {
    const {
      linkedState,
      onUpdate,
      render: Renderer,
      ...propsRest
    } = this.props;

    const RenderableLinkedState = (props) => {
      return <Renderer {...props} {...propsRest} />
    };

    this.setState({
      RenderableLinkedState: hocConnect(RenderableLinkedState, linkedState, onUpdate)
    });
  }

  render() {
    const { RenderableLinkedState } = this.state;

    if (!RenderableLinkedState) {
      return false;
    } else {
      return <RenderableLinkedState />
    }
  }
}

export default LinkedStateRenderer;