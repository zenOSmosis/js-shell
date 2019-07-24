// TODO: Extend from ContextMenu

/**
 * @typedef {Object} MenubarMenu
 * @property {string} title The menu title.
 * @property {MenubarMenuItem[]} items An array of MenubarMenu items.
 */

 /**
  * @typedef {Object} MenubarMenuItem
  * @property {string | Component} title The item title.
  * @property {boolean} isDisabled [default = false] Whether or not the item is
  * disabled.
  * @property {Function} onClick Callback handle for when the item is
  * interacted with, if not disabled.
  * @property {MenubarMenu[]} subMenus An array of sub-menus, if present. Note,
  * this overrides onClick functionality, if set.
  */