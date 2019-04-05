import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Select extends Component {
  state = {
    value: null,
    name: null,
    isOpen: false
  };

  setValue(value) {
    const {children, onChange} = this.props;

    const child = children.reduce((a, b) => {
      if (a.props.value === value) {
        return a;
      } else if (b.props.value === value) {
        return b;
      } else {
        return undefined;
      }
    });

    if (!child) {
      throw new Error(`No child with value: "${value}"`);
    }

    const {children: name} = child.props;

    this.setState({
      value,
      name
    }, () => {
      if (typeof onChange === 'function') {
        onChange(value);
      }
    });
  }

  toggleOpen() {
    const {isOpen} = this.state;

    this.setState({
      isOpen: !isOpen
    })
  }

  componentDidMount() {
    const {initialValue} = this.props;

    this.setValue(initialValue);
  }

  render() {
    const {children} = this.props;

    return (
      <Dropdown
        isOpen={this.state.isOpen}
        style={{display: 'inline-block'}}
        size="sm"
        toggle={ (evt) => this.toggleOpen() }
        // onClick={ evt => console.debug('children', children) }
      >
        <DropdownToggle caret>
          {
            this.state.name
          }
        </DropdownToggle>
        <DropdownMenu>
          {
            // <DropdownItem header>Shapes</DropdownItem>
          }
          {
            children.map((child, idx) => {
              return (
                <Option
                  key={idx}
                  {...child.props}
                  onClick={ (evt) => this.setValue(child.props.value) }
                />
              );
            })
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

const Option = (props = {}) => {
  const {children, value, onClick} = props;
  return (
    <DropdownItem onClick={onClick} value={value}>{children}</DropdownItem>
  );
};

export {
  Select,
  Option
};