import React from 'react';
import ReactSplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './style.css';
import PropTypes from 'prop-types';

// @see https://github.com/zesik/react-splitter-layout
const SplitterLayout = (props = {}) => {
  const { ...propsRest } = props;

  return (
    <ReactSplitterLayout
      {...propsRest}
      customClassName="zd-splitter-layout"
    />
  )
};

SplitterLayout.propTypes = {
  /**
   * Custom CSS class name applied to the layout div. You can use this to
   * customize layout style.
   */
  customClassName: PropTypes.string,

  /**
   * Determine whether the layout should be a horizontal split or a vertical
   * split. The default value is false.
   */
  vertical: PropTypes.bool,

  /**
   * Determine whether the width of each pane should be calculated in
   * percentage or by pixels. The default value is false, which means width
   * is calculated in pixels.
   */
  percentage: PropTypes.bool,

  /**
   * Index of the primary pane. Since SplitterLayout supports at most 2
   * children, only 0 or 1 is allowed. The default value is 0.
   * 
   * A primary pane is used to show users primary content, while a secondary
   * pane is the other pane. When window size changes and percentage is set to
   * false, primary pane's size is flexible and secondary pane's size is kept
   * unchanged. However, when the window size is not enough for showing both
   * minimal primary pane and minimal secondary pane, the primary pane's size
   * is served first.
   */
  primaryIndex: PropTypes.number,

  /**
   * Minimal size of primary pane. The default value is 0.
   * 
   * When percentage is set to false, this value is pixel size (25 means 25px).
   * When percentage is set to true, this value is percentage (25 means 25%).
   */
  primaryMinSize: PropTypes.number,

  /**
   * Minimal size of secondary pane.
   */
  secondaryMinSize: PropTypes.number,
  
  /**
   * Initial size of secondary pane when page loads.
   *
   * If this prop is not defined, SplitterLayout tries to split the layout with
   * equal sizes. (Note: equal size may not apply when there are nested
   * layouts.)
   */
  secondaryInitialSize: PropTypes.number,

  /**
   * Called when dragging is started.
   * 
   * No parameter will be passed to event handlers.
   */
  onDragStart: PropTypes.func,

  /**
   * Called when dragging finishes.
   * 
   * No parameter will be passed to event handlers.
   */
  onDragEnd: PropTypes.func,

  /**
   * Called when the size of secondary pane is changed.
   * 
   * Event handlers will be passed with a single parameter of number type
   * representing new size of secondary pane. When percentage is set to false,
   * the value is in pixel size. When percentage is set to true, the value is
   * in percentage.
   */
  onSecondaryPaneSizeChange: PropTypes.func
}

export default SplitterLayout;