import React, {Component} from 'react';

export default class BackgroundView extends Component {
  render() {
    const {children, ...propsRest} = this.props;

    return (
      <div
        {...propsRest}
      >
        BackgroundView
        {
          children
        }
      </div>
    );
  }
}