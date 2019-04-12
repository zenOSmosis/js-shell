import React from 'react';
import {Select as AntdSelect} from 'antd';
const {Option, OptGroup} = AntdSelect;

// @see https://ant.design/components/select/
const Select = (props = {}) => {
  const {children, ...propsRest} = props;

  return (
    <AntdSelect
      // Make popup render on parent
      // @see https://ant.design/docs/react/faq#Select-Dropdown-DatePicker-TimePicker-Popover-Popconfirm-scroll-with-the-page?
      getPopupContainer={trigger => trigger.parentNode}
      
      {...propsRest}
    >
      {
        children
      }
    </AntdSelect>
  );
}

export {
  Select,
  Option,
  OptGroup
};