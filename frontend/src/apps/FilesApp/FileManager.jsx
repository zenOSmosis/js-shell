import React, { Component } from 'react';
// import Window from 'components/Desktop/Window';
// import IFrame from 'components/IFrame';
// import { Layout, /* Sider, */ Content, Footer } from 'components/Layout';
// import { ButtonGroup, Button } from 'components/ButtonGroup';
// import {Menu, MenuItem} from 'components/Menu';
// import { Row, Column } from 'components/RowColumn';
// import Switch from 'components/Switch';
// import DirectoryTree from './subComponents/DirectoryTree';
// import PathBreadcrumb from './subComponents/PathBreadcrumb';
// import IconLayout from './subComponents/IconLayout';
// import { /*Input,*/ Icon as AntdIcon } from 'antd';
// import config from 'config';
// import { chdir } from 'utils/fileSystem';
import './style.css';
// import { relativeTimeRounding } from 'moment';
// import mime from 'mime-types';
// import config from '../../config';
import FilesWindow from './FilesWindow';

// import AppRegistryLinkedState from 'state/AppRegistryLinkedState';
// const commonAppRegistryLinkedState = new AppRegistryLinkedState();

// const { Search } = Input;

export default class FilesManager extends Component {
  state = {
    windows:[{},{},{}]
  };

  render() {
    const { ...propsRest } = this.props;
    const { windows } = this.state;

    return (
      windows.map(()=>(
        <FilesWindow {...propsRest} />
      ))
    );
  }
}