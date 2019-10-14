import React from 'react';
import { GridItem } from 'components/Grid';
import Layout, { Header, Content } from 'components/Layout';
import Center from 'components/Center';
import classNames from 'classnames';
import styles from './StreamGrid.module.scss';

const StreamGridItem = (props) => {
  const { children, ...propsRest } = props;

  return (
    <GridItem
      {...propsRest}
      className={styles['item']}
    >
      <Layout>
        <Header>
          <div className={classNames(styles['track-status-indicator'], styles['active'])}></div>
        </Header>
        <Content>
          <div className={styles['content-body-wrapper']}>
            <Center>
              [ media stream track ]
            </Center>
          </div>
        </Content>
      </Layout>
    </GridItem>
  );
};

export default StreamGridItem;