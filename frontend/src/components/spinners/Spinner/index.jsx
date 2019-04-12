import React from 'react';
import { Spin, Icon } from 'antd';

// @see https://ant.design/components/spin/
const Spinner = (props = {}) => {
  const {iconType: iconTypeProp, iconStyle: iconStyleProps, ...propsRest} = props;

  const iconType = iconTypeProp || 'loading';

  const iconStyle = Object.assign(
    {
      fontSize: 24,
    },    
    iconStyleProps
  );

  const antIcon = <Icon type={iconType} style={iconStyle} spin />;

  return (
    <Spin
      {...propsRest}
      indicator={antIcon}
    />
  );
};

export default Spinner;