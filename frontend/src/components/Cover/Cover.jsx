import React, {Component} from 'react';
import Full from '../Full';
import StackingContext from '../StackingContext';
import './style.css';

export default class Cover extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isVisible: true
    };
  }

  setIsVisible(isVisible) {
    this.setState({
      isVisible
    });
  }

  render() {
    const {children, className, ...propsRest} = this.props;
  
    const { isVisible } = this.state;
  
    return (
      <Full
        {...propsRest}
        className={`zd-cover ${!isVisible ? 'no-display' : ''} ${className ? className : ''}`}
      >
        <StackingContext>
          {
            children
          }
        </StackingContext>
      </Full>
    );
  }
}