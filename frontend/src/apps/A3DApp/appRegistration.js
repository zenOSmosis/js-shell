import React from 'react';
import registerApp from 'utils/desktop/registerApp';
import A3DAppMainWindow from './A3DAppMainWindow';
// import ClientGUIProcess from 'process/ClientGUIProcess';
// import Box3D from 'components/Box3D';
// import Window from 'components/Desktop/Window';
import { HOST_ICON_URL_PREFIX } from 'config';

export default registerApp({
  title: '3D App',
  view: (props) => {
    return (
      <A3DAppMainWindow {...props} />
    );
  },
  /*
  cmd: (app) => {
    new ClientGUIProcess(app, (subGUIProcess) => {
      subGUIProcess.setView(props => {
        return (
          <Box3D
            rotation={{
              degX: 20,
              degY: 20,
              translateZ: 80
            }}
            faceFront={
              <Window>
                <div style={{textAlign: 'left'}}>
                  I am a 3D window
                </div>
              </Window>
            }
          >
          </Box3D>
        );
      });
    });
  },
  */
  iconSrc: `${HOST_ICON_URL_PREFIX}cube/cube.svg`
});