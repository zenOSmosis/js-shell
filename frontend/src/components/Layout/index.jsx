import React from 'react';
import { Layout as AntdLayout } from 'antd';
import { Row, Column } from '../RowColumn';
// import {Layout as AntdLayout, Header as AntdHeader, Sider as AntdSider, Content as AntdContent, Footer as AntdFooter} from 'antd';
import './style.css';
const { Header: AntdHeader, Sider: AntdSider, Content: AntdContent, Footer: AntdFooter} = AntdLayout;

export {
  Row,
  Column
};

export const Layout = (props) => {
  const {className, children, ...propsRest} = props;

  return (
    <AntdLayout
      className={`Layout Core Common ${className ? className : ''}`}
      {...propsRest}
    >
      {
        children
      }
    </AntdLayout>
  );
};

export const Header = (props) => {
  const {className, children, ...propsRest} = props;

  return (
    <AntdHeader
      className={`Layout Common ${className ? className : ''}`}
      {...propsRest}
    >
      {
        children
      }
    </AntdHeader>
  );
};

export const Sider = (props) => {
  let {className, width, children, ...propsRest} = props;

  if (typeof width === 'undefined') {
    width = 100;
  }

  return (
    <AntdSider
      {...propsRest}
      width={width}
      className={`Layout Common ${className ? className : ''}`}
    >
      {
        children
      }
    </AntdSider>
  );
};

// Sider alias
export const Aside = Sider;

export const Content = (props) => {
  const {className, children, ...propsRest} = props;

  return (
    <AntdContent
      className={`Layout Common ${className ? className : ''}`}
      {...propsRest}
    >
      {
        children
      }
    </AntdContent>
  );
};

export const Footer = (props) => {
  const {className, children, ...propsRest} = props;

  return (
    <AntdFooter
      className={`Layout Common ${className ? className : ''}`}
      {...propsRest}
    >
      {
        children
      }
    </AntdFooter>
  );
};