import React, { Component } from 'react';
import Full from '../Full';
import Center from '../Center';
import Cover from '../Cover';
// import 'react-dropzone-uploader/dist/styles.css';
import styles from './FileDropZone.module.scss';

class FileDropZone extends Component {
  constructor() {
    super();

    this.state = {
      isDragging: false
    }

    // TODO: Determine what this is used for, and document, or remove
    this._dragCounter = 0;
  }

  _handleDragOver = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  }

  _handleDragEnter = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    this._dragCounter++;

    this.setState({ isDragging: true });
  }

  _handleDragLeave = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    this._dragCounter--;

    if (this._dragCounter === 0) {
      this.setState({ isDragging: false });
    }
  }

  _handleDrop = (evt) => {
    const { handleDrop } = this.props;
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer.files && evt.dataTransfer.files.length > 0) {
      if (typeof handleDrop === 'function') {
        handleDrop(evt.dataTransfer.files);
      }

      this.setState({ isDragging: false });

      // evt.dataTransfer.clearData();

      this._dragCounter = 0;
    }
  }

  render() {
    const { isDragging } = this.state;
    return (
      <Full
        onDragEnter={evt => this._handleDragEnter(evt)}
        onDragLeave={evt => this._handleDragLeave(evt)}
        onDragOver={evt => this._handleDragOver(evt)}
        onDrop={evt => this._handleDrop(evt)}
        className={styles['file-drop-zone']}
      >
        {
          isDragging &&
          <Cover className={styles['drag-cover']}>
            <Full className={styles['inner-full']}>
              <Center className={styles['center']}>
                <div>
                  Upload Files
                </div>
              </Center>
            </Full>
          </Cover>
        }
        {this.props.children}
      </Full>
    )
  }
}

export default FileDropZone;