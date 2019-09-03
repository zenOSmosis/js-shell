import React from 'react';
import Button from 'components/Button';
import { Breadcrumb } from 'antd';
const { Item } = Breadcrumb;

const PathBreadcrumb = (props = {}) => {
  // TODO: Rename pathConstituents to pathConstituents
  const { dirDetail, filesWindow, ...propsRest } = props;

  const pathConstituents = dirDetail.constituents || [];

  return (
    <Breadcrumb
      {...propsRest}
      separator={
        <span style={{ color: 'rgba(255,255,255,.8)' }}>/</span>
      }
    >
      {
        pathConstituents.map((part, idx) => {
          const link = (() => {
            let link = '';

            for (let i = 0; i <= idx; i++) {
              link += '/' + pathConstituents[i];
            }

            return link;
          })();

          return (
            <Item
              key={idx}
            >
              <Button disabled={idx === pathConstituents.length - 1} onClick={(evt) => filesWindow.chdir(link)} >
                {
                  idx === 0 &&
                  <span>root</span>
                }
                {
                  idx > 0 &&
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