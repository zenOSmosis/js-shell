// import React from 'react';
import AppRuntimeMenubarMenu from '../AppRuntimeMenubarMenu';

export default class AppRuntimeMenubarSystemMenu extends AppRuntimeMenubarMenu {
  constructor(...args) {
    super(...args);
    
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