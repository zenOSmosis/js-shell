import React from 'react';
import Button from '../../../Button';
import { Breadcrumb } from 'antd';
const {Item} = Breadcrumb;

const PathBreadcrumb = (props = {}) => {
  const {path, ...propsRest} = props;

  // TODO: Use a common path separator here from config
  const parts = path.split('/');

  return (
    <Breadcrumb
      size="small"
      {...propsRest}
    >
      {
        parts.map((part, idx) => {
          return (
            <Item
              key={idx}
            >
              <Button>
                {
                  part
                }
              </Button>
            </Item>
          );
        })
      }
    </Breadcrumb>
  );
};

export default PathBreadcrumb;