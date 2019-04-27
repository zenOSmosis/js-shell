import React from 'react';
import ReactSplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import './style.css';

const SplitterLayout = (props = {}) => {
  const {...propsRest} = props;

  return (
    <ReactSplitterLayout
      {...propsRest}
      customClassName="SplitterLayout"
    />
  )
}

export default SplitterLayout;