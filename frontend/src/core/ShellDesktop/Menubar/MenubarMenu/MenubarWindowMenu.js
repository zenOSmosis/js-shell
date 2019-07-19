// import React from 'react';
import MenubarMenu from './MenubarMenu';

export default class MenubarSystemMenu extends MenubarMenu {
  constructor() {
    super();
    
    this.setData({
      title: 'Window',
      items: [
        {
          title: 'Maximize'
        },
        {
          title: 'Minimize'
        }
      ]
    });
  }
}