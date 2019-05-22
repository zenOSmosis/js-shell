import React, { Component } from 'react';
import fetchwallpaperPaths from 'utils/desktop/fetchWallpaperPaths';
import getRequestURI from 'utils/fileSystem/getRequestURI';
import { commonDesktopLinkedState } from 'utils/desktop/.common';

export default class DesktopBackground extends Component {
  state = {
    wallpaperPaths: []
  };

  componentDidMount() {
    this.fetchwallpaperPaths();
  }

  async fetchwallpaperPaths() {
    try {
      const wallpaperPaths = await fetchwallpaperPaths();

      this.setState({
        wallpaperPaths
      });
    } catch (exc) {
      throw exc;
    }  
  }

  render() {
    const { wallpaperPaths } = this.state;

    return (
      <div style={{width: '100%', height: '100%', overflowY: 'auto'}}>
        {
          wallpaperPaths.map((wallpaperPath, idx) => {
            const imageURI = getRequestURI(wallpaperPath);

            return (
              <button
                style={{color: '#000', padding: 0, margin: 4, borderRadius: 4}}
                key={idx}
                onClick={ (evt) => commonDesktopLinkedState.setBackgroundURI(wallpaperPath) }
              >
                <img
                  src={imageURI}
                  alt="" // Presentational image
                  style={{width: 150, height: 150}}
                />
              </button>
            );
          })
        }
      </div>
    );
  }
}