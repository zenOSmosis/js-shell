import React, {Component} from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

const Example = (props) => {
  return (
    <div>
      <Breadcrumb tag="nav" listTag="div">
        <BreadcrumbItem tag="a" href="#">Home</BreadcrumbItem>
        <BreadcrumbItem tag="a" href="#">Library</BreadcrumbItem>
        <BreadcrumbItem tag="a" href="#">Data</BreadcrumbItem>
        <BreadcrumbItem active tag="span">Bootstrap</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export default class FileNavigator extends Component {
  render () {
    return (
      <div>
        FileNavigator

        <Example />
      </div>
    );
  }
}