import React, { Component } from 'react';
import Center from 'components/Center';
import Cover from 'components/Cover';
import Full from 'components/Full';
import SaveForLater from '../../SaveForLater';
import ConnectedReactPlayer from '../ConnectedReactPlayer';
import styles from './MediaView.module.css';
import classNames from 'classnames';
import MediaPlayerLinkedState from '../../../MediaPlayerLinkedState';
import hocConnect from 'state/hocConnect';

/**
 * @extends React.Component
 */
class MediaView extends Component {
  render() {
    const { className: propsClassName, isPIPMode: propsIsPIPMode, title, description, thumbnail, mediaPlayerLinkedState } = this.props;
    
    const className = classNames(styles['media-view'], propsClassName);
    const isPIPMode = (!propsIsPIPMode ? false : true);

    return (
      <Full className={className}>
        {
          isPIPMode &&
          <Full style={{textAlign: 'left'}}>
            <Cover>
              <Center>
                  <img alt={title} src={thumbnail} style={{float: 'left', transform: 'rotate(-10deg)'}} />
              </Center>
            </Cover>
            
            <Cover style={{backgroundColor: 'rgba(0,0,0,.4)'}}>
              {
                mediaPlayerLinkedState &&
                <SaveForLater mediaPlayerLinkedState={mediaPlayerLinkedState} />
              }
              <h1>{title}</h1>
              <div style={{fontSize: '1.1rem', fontWeight: 'bold'}}>
                {description}
              </div>
            </Cover>
          </Full>
        }

        <div className={classNames(styles['player-wrapper'], isPIPMode ? styles['pip-mode'] : '')}>
          <ConnectedReactPlayer />
        </div>
      </Full>
    );
  }
}

const ConnectedMediaView = hocConnect(MediaView, MediaPlayerLinkedState, (updatedState, mediaPlayerLinkedState) => {
  const { isInfoViewMode: isPIPMode, title, description, thumbnail } = updatedState;

  const filteredState = {
    mediaPlayerLinkedState
  };

  if (isPIPMode !== undefined) {
    filteredState.isPIPMode = isPIPMode;
  }

  if (title !== undefined) {
    filteredState.title = title;
  }

  if (description !== undefined) {
    filteredState.description = description;
  }

  if (thumbnail !== undefined) {
    filteredState.thumbnail = thumbnail;
  }

  return filteredState;
});

export default ConnectedMediaView;