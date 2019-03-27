import React, { Component } from 'react';
import './Grid.css';

/**
 * Contained within GridItemWrapper.
 */
const GridItem = (props) => {
  const {children, className, ...rest} = props;

  return (
    <div
      {...rest}
      className={`item ${className ? className : ''}`}
    >
      {children}
    </div>
  );
};

/**
 * Contains a GridItem.
 */
const GridItemWrapper = (props) => {
  const {children, className, style} = props;

  return (
    <div
      className={`item ${className ? className : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

class Grid extends Component {
  render() {
    let idx = -1;

    let {children, className} = this.props;

    // Hack to enable iterable children, even if only one child
    children = Array.isArray(children) ? children : [children];
    
    return (
      <div
        {...this.props}
        className={`gridComponent ${className ? className : ''}`}>
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