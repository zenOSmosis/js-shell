import React, { Component } from 'react';
import { /* Icon, */ Dropdown } from 'antd';
import { Menu, /* MenuDivider, */ MenuItem, /* SubMenu */ } from 'components/Menu';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import hocConnect from 'state/hocConnect';
import style from './Menubar.module.scss';
import classNames from 'classnames';
import { EVT_MENUBAR_UPDATE } from 'core/AppRuntime';

class Menubar extends Component {
  constructor(...args) {
    super(...args);

    // TODO: Pass this via hocConnect
    // this._menubarModel = new MenubarModel;

    this.state = {
      activeIdx: null,
      menus: []
    };

    // this._visibleChangeBatchTimeout = null;
  }

  componentDidUpdate(prevProps) {
    const { focusedAppRuntime: prevFocusedAppRuntime } = prevProps;
    const { focusedAppRuntime } = this.props;

    if (Object.is(prevFocusedAppRuntime, focusedAppRuntime)) {
      // Don't contiune if focused appRuntime hasn't updated
      return;
    } else if (prevFocusedAppRuntime) {
      // Unbine menubar update from previously focused AppRuntime
      prevFocusedAppRuntime.off(EVT_MENUBAR_UPDATE, this._handleAppRuntimeMenubarUpdate);
    }
    
    if (focusedAppRuntime) {
      focusedAppRuntime.on(EVT_MENUBAR_UPDATE, this._handleAppRuntimeMenubarUpdate);
    }

    this._handleAppRuntimeMenubarUpdate();
  }

  componentWillUnmount() {
    const { focusedAppRuntime } = this.props;
    if (focusedAppRuntime) {
      focusedAppRuntime.off(EVT_MENUBAR_UPDATE, this._handleAppRuntimeMenubarUpdate);
    }
  }

  _handleAppRuntimeMenubarUpdate = () => {
    const { focusedAppRuntime } = this.props;
    if (!focusedAppRuntime) {
      // TODO: Fall back to ShellDesktop menu
      this.setState({
        menus: []
      });
    } else {
      // Wait until next tick to set Menubar, as the data may change before then
      setTimeout(() => {
        if (focusedAppRuntime) {
          const menubar = focusedAppRuntime.getMenubar();

          let menus = [];

          if (menubar) {
            menus = menubar.getMenus();
          }

          this.setState({
            menus
          });
        }
      }, 1);
    }
  }

  _handleVisibleChange(idx, isVisible) {
    this.setState({
      activeIdx: (isVisible ? idx : null)
    });
  }

  _handleMenuItemClick(evt, onClickHandler) {
    if (typeof onClickHandler !== 'function') {
      console.warn('onClickHandler is not a function!');
      return;
    }

    const { focusedAppRuntime } = this.props;

    onClickHandler(evt, focusedAppRuntime);
  }

  render() {
    const { activeIdx, menus } = this.state;

    return (
      <ul className={style['menubar']}>
        {
          menus.map((menu, idx) => {
            const menuData = menu.getMenuData();

            if (!menuData) {
              return false;
            }

            const {
              title: menuTitle,
              items: menuItems
            } = menuData;

            return (
              <Dropdown
                key={idx}
                getPopupContainer={trigger => trigger.parentNode}
                trigger={['click']}
                onVisibleChange={(isVisible) => this._handleVisibleChange(idx, isVisible)}
                overlay={
                  // Override passed Menu container, using only the children of it
                  <Menu
                    className={style['dropdown-menu']}
                    mode="vertical"
                    // Close dropdown when clicking on menu item
                    onClick={(evt) => this._handleVisibleChange(idx, false)}>
                    {
                      menuItems &&
                      menuItems.map((menuItem, itemIdx) => {
                        const {
                          title,
                          onClick,
                          isDisabled: propsIsDisabled,
                        } = menuItem;

                        // Disable menus w/o an active callback
                        const isDisabled = (typeof onClick !== 'function' || propsIsDisabled);

                        return (
                          <MenuItem
                            className={style['item']}
                            key={itemIdx}
                            disabled={isDisabled}
                            onClick={evt => this._handleMenuItemClick(evt, onClick)} // TODO: Use proper click handler, and allow usage for click, touch, and Enter / Return
                          >
                            {
                              title
                            }
                          </MenuItem>
                        )
                      })
                    }
                  </Menu>
                }
              >
                <li className={classNames(style['title'], (activeIdx === idx ? style['active'] : null))}>
                  {
                    menuTitle
                  }
                </li>
              </Dropdown>
            )
          })
        }
      </ul>
    );
  }
}

export default hocConnect(Menubar, AppRuntimeLinkedState, (updatedState) => {
  const { focusedAppRuntime } = updatedState;

  const filteredState = {};

  if (focusedAppRuntime !== undefined) {
    filteredState.focusedAppRuntime = focusedAppRuntime;
  }

  return filteredState;
});

// Old menu code
/*
  menus.map((menuData, idx) => {
    // TODO: Extract Menubar Menu component

    const { menuComponent, title: menuTitle, titleStyle: menuTitleStyle } = menuData;

    return (
      <Dropdown
        key={idx}
        getPopupContainer={trigger => trigger.parentNode}
        trigger={['click']}
        overlay={
          // Override passed Menu container, using only the children of it
          <Menu
            mode="vertical"
            // Close dropdown when clicking on menu item
            onClick={(evt) => this._handleVisibleChange(idx, false)}>
            {
              menuComponent.props.children
            }
          </Menu>
        }
        onVisibleChange={(isVisible) => this._handleVisibleChange(idx, isVisible)}
      >
        <li style={menuTitleStyle} className={`zd-menubar-title ${activeIdx === idx ? 'active' : ''}`}>
          {
            menuTitle
          }
        </li>
      </Dropdown>
    )
  })
  */