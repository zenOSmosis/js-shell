import React, { Component } from 'react';
import Layout, { Header, Content } from 'components/Layout';
import Full from 'components/Full';
import Center from 'components/Center';
import Scrollable from 'components/Scrollable';
import Grid from 'components/Grid';
import StreamGridItem from './StreamGridItem';
import classNames from 'classnames';
import styles from './StreamGrid.module.scss';

class StreamGrid extends Component {
  render() {
    return (
      <Full className={classNames(styles['stream-grid'])}>
        <Layout>
          <Header className={styles['header']}>
            view
            <select>
              <option>all</option>
            </select>
          </Header>
          <Content>
            <Scrollable>
              <Center>
                <Grid>
                  <StreamGridItem>
                    A
                  </StreamGridItem>
                  <StreamGridItem>
                    B
                  </StreamGridItem>
                </Grid>
              </Center>
            </Scrollable>
          </Content>
        </Layout>
      </Full>
    );
  }
}

export default StreamGrid;