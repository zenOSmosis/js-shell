/**
 * @typedef {Object} AppRuntimeMenubarMenu
 * @property {string} title The menu title.
 * @property {AppRuntimeMenubarMenuItem[]} items An array of AppRuntimeMenubarMenu items.
 */

 /**
  * @typedef {Object} AppRuntimeMenubarMenuItem
  * @property {string | Component} title The item title.
  * @property {boolean} isDisabled [default = false] Whether or not the item is
  * disabled.
  * @property {function} onClick Callback handle for when the item is
  * interacted with, if not disabled.
  * @property {AppRuntimeMenubarMenu[]} subMenus An array of sub-menus, if present. Note,
  * this overrides onClick functionality, if set.
  */