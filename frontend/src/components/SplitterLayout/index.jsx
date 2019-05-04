import React from 'react';
import ReactSplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './style.css';

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