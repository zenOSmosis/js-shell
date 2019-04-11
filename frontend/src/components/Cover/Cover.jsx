import React, {Component} from 'react';
import './style.css';

export default class Cover extends Component {
  state = {
    isVisible: true
  };

  componentDidMount() {
    const {defaultIsVisible} = this.props;
    this.setIsVisible(defaultIsVisible);
  }

  setIsVisible(isVisible) {
    if (typeof isVisible === 'undefined') {
      let {defaultIsVisible} = this.props;
      defaultIsVisible = (typeof defaultIsVisible === 'undefined' ? true : defaultIsVisible);

      isVisible = defaultIsVisible;
    }
    
    if (isVisible !== this.state.isVisible) {
      this.setState({
        isVisible
      });
    }
  }

  render() {
    const {children, className, defaultIsVisible, ...propsRest} = this.props;
    const isVisible = this.state.isVisible;

    return (
      <div
        {...propsRest}
        className={`Cover ${!isVisible ? 'Hidden' : ''} ${className ? className : ''}`}
      >
        {
          children
        }
      </div>
    );
  }
}