import React, { Component } from 'react';
import './Grid.css';
// const style: any = require('./Grid.css');

/**
 * Contained within GridItemWrapper.
 */
class GridItem extends Component {
  render() {
    return (
      <div
        {...this.props}
        className={`item ${this.props.className ? this.props.className : ''}`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * Contains a GridItem.
 */
class GridItemWrapper extends Component {
  // TODO: Implement ability to autosize according to largest sized container
  /*public componentDidMount(): void {
  }*/

  render() {
    return (
      <div
        className={`item ${this.props.className ? this.props.className : ''}`}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}

class Grid extends Component {
  render() {
    let idx = -1;

    // Hack to enable iterable children, even if only one child
    const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    
    return (
      <div className={`gridComponent ${this.props.className ? this.props.className : ''}`}>
        <div className="flex">
          <div className="itemsWrapper">
            {
              children.map((gridItem) => {
                idx++;

                return (
                  <GridItemWrapper
                    key={idx}
                    grid={this}
                  >
                    {gridItem}
                  </GridItemWrapper>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export {
  Grid,
  GridItem
};