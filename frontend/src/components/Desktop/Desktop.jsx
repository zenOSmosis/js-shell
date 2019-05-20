import 'normalize.css/normalize.css';
import 'antd/dist/antd.css';
import './style-antd-overrides.css';
import './style.css';
import './style-scrollbar.css';

import React, { Component } from 'react';
// import Panel from './Panel';
import Dock from './Dock';
// import Notifications from './Notifications';
import WindowDrawLayer from './WindowDrawLayer';
// import WindowRouteController from './WindowRouteController';
import ContextMenu from 'components/ContextMenu';
import FullViewport from 'components/FullViewport';
import DesktopBackground from './DesktopBackground';
// import URIRedirector from './URIRedirector';
// import { BrowserRouter as Router } from 'react-router-dom';

// import LinkedStateComponent from 'state/LinkedStateComponent';
// import DesktopLinkedState from 'state/DesktopLinkedState';

export default class Desktop extends Component {
  render() {
    return (

      // <div>

      // <URIRedirector />

      <FullViewport className="zd-desktop">
        
          <ContextMenu>
        
            
              <DesktopBackground>
            
            
          
          
            {
              // Top Panel
            }

            {
              // <Panel />
            }

            {
              // <Notifications />
            }
            
            

            {
              // TODO: Implement DrawersLayer as a separate component
              // @see https://ant.design/components/drawer/
              /*
              <Drawer
                mask={false}
                bodyStyle={{backgroundColor: 'rgba(0,0,0,.4)'}}
                onContextMenu={ (evt) => alert('context') }
                placement="right"
                visible={true}
              >
                Well, hello
              </Drawer>
              */
            }

            {
              // Binds windows to URI location; sets page title
            }
            {
              // <WindowRouteController />
            }
            
            
            {
              // Renders windows
            }
            <WindowDrawLayer />
            
            

            {
              // Bottom Dock
            }

            
            <Dock />
            

            
            
              </DesktopBackground>
            
              
            

            
              </ContextMenu>
            
      </FullViewport>
    );
  }
}