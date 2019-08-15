import React, { Component } from 'react';
import { /* Icon, */ Dropdown } from 'antd';
import { Menu, /* MenuDivider, */ MenuItem, /* SubMenu */ } from 'components/Menu';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import hocConnect from 'state/hocConnect';
import './style.css';
// import { Menubar as MenubarModel } from 'core/ShellDesktop';

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
    
    // Don't contiune if props haven't updated
    if (Object.is(prevProps.focusedAppRuntime, this.props.focusedAppRuntime)) {
      return;
    }

    // TODO: Handle accordingly
    // console.debug('Menubar component updated', this.props);

    const { focusedAppRuntime } = this.props;
    if (focusedAppRuntime) {
      // Wait until next tick to set Menubar, as the data may change before then
      setTimeout(() => {
        const menubar = focusedAppRuntime.getMenubar();

        const menus = menubar.getMenus();
  
        this.setState({
          menus
        });
      }, 1);
    } else {
      // TODO: Temporary fix; don't leave like this
      this.setState({
        menus: []
      });
    }
  }

  handleVisibleChange(idx, isVisible) {
    this.setState({
      activeIdx: (isVisible ? idx : null)
    });
  }

  /*
  handleMenuClick = (e) => {
    if (e.key === '3') {
      this.setState({ visible: false });
    }
  }
  */

  render() {
    const { activeIdx, menus } = this.state;

    return (
      <ul className="zd-menubar">
        {
          menus.map((menu, idx) => {
            const menuData = menu.getMenuData();

            const {
              title: menuTitle,
              items: menuItems
            } = menuData;
            
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
                    onClick={(evt) => this.handleVisibleChange(idx, false)}>
                    {
                      menuItems &&
                      menuItems.map((menuItem, itemIdx) => {
                        const {
                          title,
                          onClick
                        } = menuItem;

                        return (
                          <MenuItem
                            key={itemIdx}
                            onClick={onClick} // TODO: Use proper click handler, and allow usage for click, touch, and Enter / Return
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
                onVisibleChange={(isVisible) => this.handleVisibleChange(idx, isVisible)}
              >
                <li className={`zd-menubar-title ${activeIdx === idx ? 'active' : ''}`}>
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

  if (typeof focusedAppRuntime !== 'undefined') {
    return {
      focusedAppRuntime
    };
  }
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
            onClick={(evt) => this.handleVisibleChange(idx, false)}>
            {
              menuComponent.props.children
            }
          </Menu>
        }
        onVisibleChange={(isVisible) => this.handleVisibleChange(idx, isVisible)}
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