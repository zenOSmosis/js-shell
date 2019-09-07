import React, { Component } from 'react';
import { /* Icon, */ Dropdown } from 'antd';
import { Menu, /* MenuDivider, */ MenuItem, /* SubMenu */ } from 'components/Menu';
import AppRuntimeLinkedState from 'state/AppRuntimeLinkedState';
import hocConnect from 'state/hocConnect';
import style from './Menubar.module.scss';
import classNames from 'classnames';
import { EVT_MENUBAR_UPDATE } from 'core/AppRuntime';
import KeyboardLinkedState, {
  // STATE_PRESSED_MODIFIERS,
  STATE_PRESSED_NORMALIZED_KEY,
  STATE_PRESSED_EVT,

  NORMALIZED_KEY_ENTER,
  NORMALIZED_KEY_ESCAPE,
  NORMALIZED_KEY_ARROW_UP,
  NORMALIZED_KEY_ARROW_RIGHT,
  NORMALIZED_KEY_ARROW_DOWN,
  NORMALIZED_KEY_ARROW_LEFT
} from 'state/KeyboardLinkedState';

class Menubar extends Component {
  constructor(...args) {
    super(...args);

    // TODO: Pass this via hocConnect
    // this._menubarModel = new MenubarModel;

    this.state = {
      activeTopLevelIdx: null,
      menus: [],

      // TODO: Make this work for multi-level menus
      activeMenuItemIdx: null
    };

    // this._visibleChangeBatchTimeout = null;

    this._keyboardLinkedState = new KeyboardLinkedState();
  }

  componentDidMount() {
    this._keyboardLinkedState.on('update', (updatedState) => {
      let { activeTopLevelIdx, activeMenuItemIdx, menus } = this.state;

      if (activeTopLevelIdx !== null) {
        const {
          [STATE_PRESSED_NORMALIZED_KEY]: pressedNormalizedKey,
          [STATE_PRESSED_EVT]: pressedEvt
        } = updatedState;

        if (!pressedNormalizedKey) {
          return;
        }

        switch (pressedNormalizedKey) {
          case NORMALIZED_KEY_ENTER:
            (() => {
              const menu = menus[activeTopLevelIdx];
              const { items } = menu.getMenuData();
              const menuItem = items[activeMenuItemIdx];

              this._handleMenuItemClick(pressedEvt, menuItem.onClick);
            })();
            break;

          case NORMALIZED_KEY_ESCAPE:
            this.closeMenubar();
            break;

          case NORMALIZED_KEY_ARROW_UP:
            if (activeMenuItemIdx - 1 >= 0) {
              activeMenuItemIdx--;

              this._activateMenuItemWithIdx(activeMenuItemIdx);
            }
            break;

          case NORMALIZED_KEY_ARROW_DOWN:
            (() => {
              const menu = menus[activeTopLevelIdx];
              const { items } = menu.getMenuData();
              if (activeMenuItemIdx + 1 < items.length) {
                activeMenuItemIdx++;
              }

              this._activateMenuItemWithIdx(activeMenuItemIdx);
            })();
            break;

          case NORMALIZED_KEY_ARROW_LEFT:
            if (activeTopLevelIdx - 1 >= 0) {
              activeTopLevelIdx--;

              this._handleTopLevelMenuVisibleChange(activeTopLevelIdx, true);
            }
            break;

          case NORMALIZED_KEY_ARROW_RIGHT:
            if (activeTopLevelIdx + 1 < menus.length) {
              activeTopLevelIdx++;

              this._handleTopLevelMenuVisibleChange(activeTopLevelIdx, true);
            }
            break;
        }
      }
    });
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

    this._keyboardLinkedState.destroy();
    this._keyboardLinkedState = null;
  }

  /**
   * Determines if a top-level-menu is currently active.
   * 
   * @return {boolean}
   */
  getIsMenubarActive() {
    const { activeTopLevelIdx } = this.state;

    return activeTopLevelIdx !== null;
  }

  _activateMenuItemWithIdx(idx) {
    this.setState({
      activeMenuItemIdx: idx
    });
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

  _handleTopLevelMenuMouseOver(idx) {
    if (this.getIsMenubarActive()) {
      this._handleTopLevelMenuVisibleChange(idx, true);
    }
  }

  _handleTopLevelMenuVisibleChange(idx, isVisible) {
    this.setState({
      activeTopLevelIdx: (isVisible ? idx : null),
      activeMenuItemIdx: (isVisible ? 0 : null)
    });
  }

  _handleMenuItemClick(evt, onClickHandler) {
    if (typeof onClickHandler !== 'function') {
      console.warn('onClickHandler is not a function!');
      return;
    }

    const { focusedAppRuntime } = this.props;

    onClickHandler(evt, focusedAppRuntime);

    this.closeMenubar();
  }

  closeMenubar() {
    this._handleTopLevelMenuVisibleChange(0, false)
  }

  render() {
    const { activeTopLevelIdx, activeMenuItemIdx, menus } = this.state;

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
                onClick={evt => this._handleAppRuntimeMenubarUpdate(idx, true)}
                visible={activeTopLevelIdx === idx}
                onVisibleChange={(isVisible) => this._handleTopLevelMenuVisibleChange(idx, isVisible)}
                overlay={
                  // Override passed Menu container, using only the children of it
                  <Menu
                    className={style['dropdown-menu']}
                    mode="vertical"
                  >
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
                            className={classNames(style['item'], (activeMenuItemIdx === itemIdx ? style['active'] : null))}
                            key={itemIdx}
                            disabled={isDisabled}
                            onMouseOver={evt => this._activateMenuItemWithIdx(itemIdx)}
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
                <li
                  className={classNames(style['title'], (activeTopLevelIdx === idx ? style['active'] : null))}
                  onMouseOver={evt => this._handleTopLevelMenuMouseOver(idx)}
                >
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
            onClick={(evt) => this._handleTopLevelMenuVisibleChange(idx, false)}>
            {
              menuComponent.props.children
            }
          </Menu>
        }
        onVisibleChange={(isVisible) => this._handleTopLevelMenuVisibleChange(idx, isVisible)}
      >
        <li style={menuTitleStyle} className={`zd-menubar-title ${activeTopLevelIdx === idx ? 'active' : ''}`}>
          {
            menuTitle
          }
        </li>
      </Dropdown>
    )
  })
  */