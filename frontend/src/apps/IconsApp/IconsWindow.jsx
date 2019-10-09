import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Scrollable from 'components/Scrollable';
import Grid, { GridItem } from 'components/Grid';

export default class IconsWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      icons: []
    }
  }

  componentDidMount() {
    (async () => {
      try {
        const iconModules = await import('components/componentIcons');

        const icons = [];
        for (let name in iconModules) {
          icons.push({
            name,
            Component: iconModules[name]
          });
        }

        this.setState({
          icons
        });
      } catch (exc) {
        throw exc;
      }
    })();
  }

  render() {
    const { ...propsRest } = this.props;
    const { icons } = this.state;

    return (
      <Window
        {...propsRest}
      >
        {
          !icons.length ?
          <span>loading</span>
          :
          <Scrollable>
            <Grid>
            {
              icons.map((icon, idx) => {
                const { name, Component: IconComponent } = icon;

                return (
                  <GridItem
                    key={idx}
                    style={{margin: 10}}
                  >
                    <IconComponent style={{fontSize: 30}} />

                    <div>
                      {name}
                    </div>
                  </GridItem>
                );
              })
            }
            </Grid>
          </Scrollable>
        }
      </Window>
    );
  }
}