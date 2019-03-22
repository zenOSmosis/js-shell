import React, {Component} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Select GPU
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Discreet GPU</DropdownItem>
          <DropdownItem>AMD</DropdownItem>
          <DropdownItem divider />
          <DropdownItem header>Integrated Graphics</DropdownItem>
          <DropdownItem>Intel</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default class GPUSelector extends Component {
  render () {
    return (
      <div>
        GPUSelector
        <Example />
      </div>
    );
  }
}