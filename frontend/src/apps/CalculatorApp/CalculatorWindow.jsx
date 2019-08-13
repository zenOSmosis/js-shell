import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Display from "./component/Display";
import ButtonPanel from "./component/ButtonPanel";
import calculate from "./logic/calculate";
//import ".component/App.css";

export default class CalculatorWindow extends Component {
  state = {
    total: null,
    next: null,
    operation: null,
  };

  handleClick = buttonName => {
    this.setState(calculate(this.state, buttonName));
  };

  render() {
    const { ...propsRest } = this.props;
    return (
      <Window
        {...propsRest}
        minWidth={300}
        minHeight={281}
        sizeable={false}
      >
        <div className="component-app">
          <Display value={this.state.next || this.state.total || "0"} />
          <ButtonPanel clickHandler={this.handleClick} />
        </div>
      </Window>
    );
  }
}

