import React from 'react';
import MenubarMenu from './MenubarMenu';

export default class MenubarAppMenu extends MenubarMenu {
  constructor() {
    super();
    
    this.setData({
      title: <span style={{ fontWeight: 'bold' }}>App</span>,
      items: [
        {
          title: 'Close',
          onClick: () => {
            focusedDesktopChildGUIProcess.close();
          }
        }
      ]
    });
  }
}