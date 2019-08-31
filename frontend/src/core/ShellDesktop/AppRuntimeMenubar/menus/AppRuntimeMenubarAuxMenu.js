import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';

export default class AppRuntimeMenubarAuxMenu extends AppRuntimeMenubarMenu {
  constructor(menubar, menuData) {
    super(menubar);
    
    this.setData(menuData);
  }
}