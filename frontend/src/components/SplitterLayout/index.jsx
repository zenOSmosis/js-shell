import React from 'react';
import ReactSplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './style.css';

// @see https://github.com/zesik/react-splitter-layout
const SplitterLayout = (props = {}) => {
  const {...propsRest} = props;

  return (
    <ReactSplitterLayout
      {...propsRest}
      customClassName="zd-splitter-layout"
    />
  )
}

export default SplitterLayout;