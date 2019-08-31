import React from 'react';
import {Menu as AntdMenu} from 'antd';
const {
    Item: MenuItem,
    ItemGroup: MenuItemGroup,
    Divider: MenuDivider,
    SubMenu
} = AntdMenu;

export const MENU_THEME_DARK = 'dark';
export const MENU_THEME_LIGHT = 'light';

// @see https://ant.design/components/menu/
const Menu = (props = {}) => {
  const {
      children,
      getPopupContainer: propsGetPopupContainer,
      theme: propsTheme,
      ...propsRest
  } = props;

  const getPopupContainer = propsGetPopupContainer || ((trigger) => trigger.parentNode);

  const theme = propsTheme || MENU_THEME_DARK;

  console.warn('TODO: Use right triangle SVG in menu expansion');

  return (
    <AntdMenu
      theme={theme}
      {...propsRest}
      getPopupContainer={ getPopupContainer }
      expandIcon={
        <span className="ant-dropdown-menu-submenu-arrow">..</span>
      }
      // Extended API: @see https://github.com/react-component/menu#api
      // subMenuOpenDelay={0}
      // subMenuCloseDelay={1.5} // Important, if set to 0, the Menu may close
      // before trying to select a SubMenu item
    >
      {children}
    </AntdMenu>
  );
};

export default Menu;
export {
  Menu,
  MenuItem,
  MenuItemGroup,
  MenuDivider,
  SubMenu
};