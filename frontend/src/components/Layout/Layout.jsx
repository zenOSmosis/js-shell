import React from 'react';
import Full from '../Full';
import { Row, Column } from '../RowColumn';
import Section from '../Section';
import styles from './Layout.module.css';
import classNames from 'classnames';

export {
  Row,
  Column,

  Section
};

export const Layout = (props) => {
  const { className, children, ...propsRest } = props;

  return (
    <Full
      { ...propsRest }
      className={classNames(styles['layout'], className)}
    >
      {
        children
      }
    </Full>
  );
};

export const Header = (props) => {
  const { className, children, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={classNames(styles['header'], className)}
    >
      {
        children
      }
    </div>
  );
};

export const Content = (props) => {
  const { className, children, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={classNames(styles['content'], className)}
    >
      {
        children
      }
    </div>
  );
};
export const Footer = (props) => {
  const { className, children, ...propsRest } = props;

  return (
    <div
      {...propsRest}
      className={classNames(styles['footer'], className)}
    >
      {
        children
      }
    </div>
  );
};

export default Layout;