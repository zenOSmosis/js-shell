import React from 'react';
import {Menu as AntdMenu} from 'antd';
const {
    Item: MenuItem,
    Divider: MenuDivider,
    SubMenu
} = AntdMenu;

export const MENU_THEME_DARK = 'dark';
export const MENU_THEME_LIGHT = 'light';

// @see https://ant.design/components/menu/
const Menu = (props = {}) => {
  const {children, theme: propsTheme, ...propsRest} = props;

  const theme = propsTheme || MENU_THEME_DARK;

  return (
    <AntdMenu
      theme={theme}
      {...propsRest}
    >
      {children}
    </AntdMenu>
  );
};

export {
  Menu,
  MenuItem,
  MenuDivider,
  SubMenu
};